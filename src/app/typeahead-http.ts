import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of, pipe } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { searchResult, result, typesOf, match, Query } from '../app/types';
import { resultKeyNameFromField } from 'apollo-utilities';


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
          //map(response => response.results[0].matches.map(a => a.string))
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



export class NgbdTypeaheadHttp implements OnInit {

  searchForm: FormGroup;
  submitted = false;
  model: any;
  searching = false;
  searchFailed = false;
  items: Array<string> = [];
  searchResult: searchResult;
  resultFromSparql: result[];
  page: number;
  total: Promise<number>;
  constructor(private formBuilder: FormBuilder, private apollo: Apollo) { }


  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchText: ['', Validators.required]
    });

    this.total = new Promise(resolve => setTimeout(() => resolve(50), 100));
    

  }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.apollo.watchQuery<Query>({
          query: gql`query Search($uiText: String)
                  {
                    search(text: $uiText) {
                      term
                      results {
                        matches {
                          string
                        }
                      }
                    }
                  }`, variables: { uiText: term + "*" }
        }).valueChanges.pipe(
          map(result => result.data.search.results[0].matches.map(a => a.string)),
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )


  onSubmit() {
    this.submitted = true;

    console.log(this.searchForm.controls.searchText.value)
    // stop here if form is invalid
    if (this.searchForm.invalid) {
      return;
    }

    this.apollo.query<Query>({
      query: gql`query Search($uiText: String)
                  {
                    search(text: $uiText) {
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
                  }`, variables: { uiText: this.searchForm.controls.searchText.value }
    })
      .subscribe((res) => {
        console.log(res);
        this.searchResult = res.data.search;
        this.resultFromSparql = res.data.search.results;
      });


    /*this._apiService.search(this.searchForm.value.searchText, false).pipe(
      tap(() => this.searchFailed = false),
      catchError(() => {
        this.searchFailed = true;
        return of([]);
      })).subscribe(result => {
        this.items.length = 0;
        console.log(result);
        this.items.push(result)
      });*/

  }

  pageChanged(page) {
    console.log('Page changed: ' + page);
  }

}
