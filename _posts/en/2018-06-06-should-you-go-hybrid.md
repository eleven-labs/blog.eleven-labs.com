---
layout: post
title: Should you go hybrid? Pros and cons for the hybrid cloud
lang: en
permalink: /should-you-go-hybrid/
excerpt: "Relevance of the hybrid cloud to the enterprise is growing. There was a three-fold jump in hybrid cloud adoption between 2016 and 2017, reflecting the attractiveness of such a setup for enterprises looking to leverage the benefits of cloud computing. Here are some key pros and cons of the hybrid cloud, to help you decide if such a setup is best for your business."
authors:
    - limor.wainstein
categories:
    - cloud
tags:
    - cloud
cover: /assets/2018-06-06-should-you-go-hybrid/cover.jpg
---

The hybrid cloud is an approach to implementing cloud computing by combining both public cloud (external) and private
cloud (internal) infrastructure.
There was a three-fold jump in [hybrid cloud adoption](https://www.forbes.com/consent/?toURL=https://www.forbes.com/sites/louiscolumbus/2017/04/23/2017-state-of-cloud-adoption-and-security/)
between 2016 and 2017, reflecting the attractiveness of such a setup for enterprises looking to leverage the benefits of
cloud computing.

The public component of the hybrid cloud refers to cloud compute and storage accessible via the Internet as services to
many different clients.
The private component refers to secure computing environments which are only accessible to a single client, either via a
private network connection or hosted on-premises.

Enterprises can use a hybrid cloud setup to operate their main data center in a private cloud for running
mission-critical apps while using public cloud services for disaster recovery.
Cloud bursting is another attractive use case, in which enterprises direct overflow traffic from their workloads from
the private cloud to the public cloud during periods of peak demand.

Below are some of the main pros and cons of the hybrid cloud, which you can use to help you decide if such a setup is
best for your business.

## Hybrid Cloud Pros
### Greater Flexibility
The hybrid cloud provides the best flexibility out of all possible cloud setups by allowing companies to decide which
workflows and processes should run on each different type of cloud service.
Companies can prioritize their mission-critical apps for use on private cloud systems while the public cloud can be used
for functions less central to daily operations, such as archiving resting data.

Furthermore, the computing environment for applications can be changed instantly according to changing needs without
having to provision expensive new hardware.

### Pay Per Use
One of the main perks of going hybrid is the cost savings resulting from paying for exactly the additional IT resources
your enterprise needs outside its main private cloud or on-premise data center.
Public cloud services don’t require any capital expenditure or maintenance costs for hardware — simply pay for the extra
storage or computing that you need

### Better Business Continuity and Disaster Recovery
The ability to failover to a public cloud service provider in the event of an outage in private systems enhances the
business continuity strategy for adopters of the hybrid cloud.
Off-site locations for disaster recovery help to mitigate [single points of failure](https://www.pivotpointsecurity.com/blog/mitigating-single-points-of-failure/),
which are seen as the bane of any disaster recovery plan.

The hybrid cloud is a vendor-agnostic option because it doesn’t tie your company to the services of a particular vendor,
which protects you from relying solely on a single company to deliver required IT functionalities.

## Hybrid Cloud Cons
### Security Concerns
Trusting another vendor to responsibly store company data off-site leads to an entirely new set of security concerns.
The public cloud requires a leap of faith that the chosen vendor has a watertight security policy.
At a bare minimum, the public cloud provider should offer data protection mechanisms such as encryption and strong
user-access management policies.
Good examples here are [Google’s IAM](https://cloud.google.com/iam/) and [AWS IAM](https://aws.amazon.com/iam/) both of
which offer a singular view over the entire organization in terms of who can access particular cloud resources.

It’s also a good idea to check for compliance with relevant industry regulations when moving data from on-premises
systems to the public cloud.

### Lack of Cost Transparency
Even though the hybrid cloud is touted as a cost-effective deployment compared to solely on-premise or private cloud
setups, it can be difficult to retain full transparency over cloud storage costs when you go hybrid.

Cost visibility is a problem due to different factors; two of them being the provisioning of additional resources
(storage, queries, etc.) and unintentional wastage by developers or other teams.
Another difficulty with hybrid cloud storage costs is that different vendors have different pricing plans, with some
charging per data volume queried, making it difficult to estimate and plan costs in the short-term and long-term.

[Netapp’s post](https://cloud.netapp.com/blog/handling-storage-cost-and-cloud-sprawl) on handling the costs of cloud
storage can help guide you on the difficulty of dealing with cloud cost sprawl in a hybrid setup.

### Complexity
It is a complex task to manage applications, data, and workloads in a hybrid infrastructure.
For example, an application workload might be in a public cloud while its data is housed within an on-premise data
center or private cloud. In such a scenario, it’s imperative to ensure the application is built to access the data
remotely the network connection between the two is not a bottleneck.

A technique such as [copy data management](https://searchstorage.techtarget.com/definition/copy-data-management-CDM) can
help to decouple data from underlying infrastructure and avoid issues with applications and data residing in different
cloud systems.

## Wrap Up
The decision about whether to adopt a hybrid cloud solution comes down to whether the pros outweigh the cons.
Bear in mind that there are solutions available to address the main cons of going hybrid and that the majority of
enterprises favor a hybrid cloud implementation compared to going full private cloud or not using the cloud at all.
