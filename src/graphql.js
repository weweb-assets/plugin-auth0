import gql from 'graphql-tag';

export const GET_AUTH0_USERS = gql`
    query GetAuth0Users($designId: String!, $settingsId: String!) {
        getAuth0Users(designId: $designId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const GET_AUTH0_ROLES = gql`
    query GetAuth0Roles($designId: String!, $settingsId: String!) {
        getAuth0Roles(designId: $designId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const GET_AUTH0_CLIENTS = gql`
    query GetAuth0Clients($designId: String!, $settingsId: String!, $domain: String, $token: String) {
        getAuth0Clients(designId: $designId, settingsId: $settingsId, domain: $domain, token: $token) {
            success
            data
        }
    }
`;

export const CREATE_AUTH0_CLIENT = gql`
    mutation CreateAuth0Client(
        $designId: String!
        $settingsId: String!
        $domain: String
        $token: String
        $data: JSON!
    ) {
        createAuth0Client(designId: $designId, settingsId: $settingsId, domain: $domain, token: $token, data: $data) {
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

export const GET_AUTH0_RULES = gql`
    query GetAuth0Rules($designId: String!, $settingsId: String!) {
        getAuth0Rules(designId: $designId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const CREATE_AUTH0_RULE = gql`
    mutation CreateAuth0Rule($designId: String!, $settingsId: String!, $data: JSON!) {
        createAuth0Rule(designId: $designId, settingsId: $settingsId, data: $data) {
            success
            data
        }
    }
`;

export const GET_AUTH0_CONNECTIONS = gql`
    query GetAuth0Connections($designId: String!, $settingsId: String!) {
        getAuth0Connections(designId: $designId, settingsId: $settingsId) {
            success
            data
        }
    }
`;

export const UPDATE_CURRENT_USER = gql`
    mutation UpdateAuth0CurrentUser($designId: String!, $settingsId: String!, $data: JSON!) {
        updateAuth0CurrentUser(designId: $designId, settingsId: $settingsId, data: $data) {
            success
            data
        }
    }
`;
