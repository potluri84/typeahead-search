import { searchResult, result, typesOf, match, Query } from '../app/types';
import gql from 'graphql-tag'


export const SEARCH_QUERY = gql`
  query search(term: this.searchForm.value.searchText)
        {
    term
    results {
      uri
      label
      types {
        uri
      }
      matches {
        propertyUri
        string
      }
    }
  }
`;

// 3
export interface SEARCHQUERYRESPONSE {
    search: searchResult;
    loading: boolean;
}