import gql from 'graphql-tag';

export const GET_AUTH0_ROLES = gql`
    query GetAuth0Roles($designId: String!, $settingsId: String!) {
        getAuth0Roles(designId: $designId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const UPDATE_AUTH0_CLIENT = gql`
    mutation UpdateAuth0Client($designId: String!, $settingsId: String!, $clientId: String!, $data: JSON!) {
        updateAuth0Client(designId: $designId, settingsId: $settingsId, clientId: $clientId, data: $data) {
            success
            data
        }
    }
`;
