import type { CodegenConfig } from "@graphql-codegen/cli";
require("dotenv").config();

const toBase64 = (str: string) => Buffer.from(str).toString("base64");
const authHeader = toBase64(
  `${process.env.GRAPHQL_USER}:${process.env.GRAPHQL_PASSWORD}`
);
const graphQLEndpoint = process.env.GRAPHQL_ENDPOINT || "http://localhost:8000";

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [graphQLEndpoint]: {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    },
  },
  documents: "./src/**/!(*.d).{ts,tsx,gql}",
  generates: {
    "src/queries/__generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
        {
          add: {
            placement: "prepend",
            content: `
            // @ts-nocheck
            // eslint-disable
            export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];
            export type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never;
          `,
          },
        },
        {
          add: {
            placement: "append",
            content: `
            export const getApi = (token?: string) => {
              const headers = { authorization: "Basic ${authHeader}" };
              return getSdk(new GraphQLClient(
                '${graphQLEndpoint}',
                { headers }
              ));
            }
          `,
          },
        },
      ],
    },
  },
  config: {
    noExport: false,
    maybeValue: "ExcludeEmpty<T>",
    // skipTypename: true,
    preResolveTypes: true,
    // avoidOptionals: false,
    pureMagicComment: true,
    onlyOperationTypes: true,
    inlineFragmentTypes: "combine",
    dedupeFragments: true,
  },
};

export default config;
