/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoute = /* GraphQL */ `
  subscription OnCreateRoute(
    $filter: ModelSubscriptionRouteFilterInput
    $owner: String
  ) {
    onCreateRoute(filter: $filter, owner: $owner) {
      id
      title
      description
      createdAt
      owner
      updatedAt
      __typename
    }
  }
`;
export const onUpdateRoute = /* GraphQL */ `
  subscription OnUpdateRoute(
    $filter: ModelSubscriptionRouteFilterInput
    $owner: String
  ) {
    onUpdateRoute(filter: $filter, owner: $owner) {
      id
      title
      description
      createdAt
      owner
      updatedAt
      __typename
    }
  }
`;
export const onDeleteRoute = /* GraphQL */ `
  subscription OnDeleteRoute(
    $filter: ModelSubscriptionRouteFilterInput
    $owner: String
  ) {
    onDeleteRoute(filter: $filter, owner: $owner) {
      id
      title
      description
      createdAt
      owner
      updatedAt
      __typename
    }
  }
`;
