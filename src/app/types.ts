export class searchResult  {
    term: String
    results: [result]
}

export class result {
    uri: String
    label: String
    types: [typesOf]
    matches: [match]
}

export class typesOf {
    uri: String
}

export class match {
    propertyUri: String
    string: String
}

export type Query = {
    search: searchResult
}