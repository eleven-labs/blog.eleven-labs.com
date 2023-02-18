import React from 'react';
import { useRouteError } from 'react-router-dom';

export const NotFoundPageContainer: React.FC = () => {
  const error = useRouteError();
  console.log({ error });

  return <>Not Found Page</>;
};
