---
layout: post
lang: fr
date: '2023-04-10'
categories: []
authors:
  - tthuon
excerpt: "Découverte d'un orchestrateur de tâche avec Apache Airflow"
title: Découverte d'un orchestrateur de tâche avec Apache Airflow
slug: apache-airflow
permalink: /fr/apache-airflow/
---

```python
from datetime import datetime

from airflow.decorators import dag, task


@dag(schedule_interval="@daily", start_date=datetime.now())
def nombre_velo_nantes():
    @task(multiple_outputs=True)
    def fetch_data_from_nantes_api(data_interval_start: datetime = None, run_id: str = None, **kwargs) -> dict:
        if data_interval_start is None or run_id is None:
            raise Exception("Start date or run_id not provided.")

        from datetime import timedelta
        import requests as r
        import json

        yesterday = data_interval_start - timedelta(days=1)
        query_params = {
            "where": "jour = date'{}'".format(yesterday.strftime("%Y/%m/%d")),
            "order_by": "jour desc",
            "limit": 100,
            "timezone": "UTC"
        }
        j = r.get(
            url="https://data.nantesmetropole.fr/api/v2/catalog/datasets/244400404_comptages-velo-nantes-metropole/records",
            params=query_params
        ).json()

        if j["total_count"] == 0:
            raise Exception("No results found")

        if j["total_count"] > 100:
            raise Exception("Pagination not implemented.")

        path_raw = "/opt/airflow/dags/raw-{}.json".format(run_id)
        with open(path_raw, mode="w") as raw:
            raw.write(json.dumps(j["records"]))
            raw.close()

        return {"path_raw": path_raw, "init_run_id": run_id}

    @task()
    def reshape(path: str, init_run_id: str) -> str:
        import pandas as pd
        df = pd.read_json(path)
        transformed_df = None

        for index, value in df["record"].items():
            if transformed_df is None:
                transformed_df = pd.DataFrame(data=[value["fields"]])
                continue
            transformed_df = pd.concat([transformed_df, pd.DataFrame(data=[value["fields"]])], ignore_index=True)

        path_reshape = "/opt/airflow/dags/reshape-{}.json".format(init_run_id)
        with open(path_reshape, mode="w") as reshaped_file:
            transformed_df.to_json(reshaped_file)

        return path_reshape

    @task()
    def load_to_mongo(path: str) -> None:
        from airflow.providers.mongo.hooks.mongo import MongoHook
        from datetime import datetime
        from dateutil.tz import tz
        import pandas as pd

        m = MongoHook()
        df = pd.read_json(path)
        date_data = None
        for k, row in df.iterrows():
            if date_data is None:
                date_data = datetime.strptime(row["jour"], "%Y-%m-%d")

            docs = []
            for i, count in row.items():
                try:
                    hour = int(i)
                except ValueError:
                    continue
                date_data = date_data.replace(hour=hour, minute=0, second=0, microsecond=0,
                                              tzinfo=tz.gettz("Europe/Paris"))

                docs.append({
                    "boucle_libelle": row["boucle_libelle"],
                    "jour": date_data,
                    "compte": count
                })

            collection = m.get_collection("velo", "velo")
            collection.insert_many(docs)

        return None

    raw_file_path = fetch_data_from_nantes_api()
    reshape_file_path = reshape(raw_file_path["path_raw"], raw_file_path["init_run_id"])
    load_to_mongo(reshape_file_path)


pipeline_velo_nantes = nombre_velo_nantes()
```
