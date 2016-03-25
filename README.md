# ecaas - elm-compiler as a service

One endpoint:

- `POST /compile`
  - `source : String` &ndash; the content of the Elm module to compile. The name
    of the module must be `Main`.
  - `runtime : Bool` &ndash; whether to include the full Elm runtime and core
    libraries in the response.

To start:

`npm i -g elm`
`npm i`
`npm start`
