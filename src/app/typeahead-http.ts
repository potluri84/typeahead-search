import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpParams,HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(WIKI_URL, {params: PARAMS.set('search', term)}).pipe(
        map(response => response[1])
      );
  }
}


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Basic YWRtaW46YWRtaW4='
  })
};

@Injectable()
export class ApiService {
  baseUrlForRest: string = 'http://localhost:5820/annex/appmon/search/';

  baseUrl: string = 'http://localhost:4000/graphql';

  constructor(private _http: HttpClient) { }


  search(queryString: string, graph: boolean) {
    if (graph === true && queryString !== "") {
      let _URL = this.baseUrl;
      console.log('url', _URL);
      return this._http.post(_URL,
        { "operationName": null, "variables": {}, "query": "{\n  search(text: \"" + queryString + "*\") {\n    term\n    results {\n      uri\n      label\n      types {\n        uri\n      }\n      matches {\n        propertyUri\n        string\n      }\n    }\n  }\n}\n" }
        , httpOptions
      ).pipe(map(response => response[1])
      );
    }
    else if (queryString !== "") {
      {
        let _URL = this.baseUrlForRest + queryString + '*';
        console.log('url', _URL);
        return this._http.get(_URL, httpOptions).pipe(
          map(response => response.results[0].matches.map(a => a.string))
        );
      }
    }
    else {
      return new Observable();
    }
  }
}



@Component({
  selector: 'ngbd-typeahead-http',
  templateUrl: './typeahead-http.html',
  providers: [ApiService],
  styles: [`.form-control { width: 300px; display: inline; }`]
})
export class NgbdTypeaheadHttp {
  model: any;
  searching = false;
  searchFailed = false;

  constructor(private _apiService: ApiService) {}

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._apiService.search(term,false).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
}
