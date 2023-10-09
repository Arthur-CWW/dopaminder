import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { getUrl } from "~/utils/validator";
// import dns
import dns from "dns";
import { TRPCError } from "@trpc/server";
import { websitesAddrs } from "~/server/db/schema";
async function lookupPromise(url: string) {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, address, family) => {
      if (err) reject(err);
      resolve(address);
    });
  });
}
export const sitelistRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  checkWebsite: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // validate url then check
      const url = input.url;
      const { Url } = getUrl(input.url);
      if (!Url) {
        throw new TRPCError({
          message: `The url is not valid ${url}`,
          code: "BAD_REQUEST",
          cause: {
            url: url,
          },
        });
      }

      const domain = input.url;
      try {
        // check if the website is in the db
        // if yes, return the ip
        // if no, check the ip and save to db
        const db = ctx.db;
        const cache = await db.query.websitesAddrs.findFirst({
          where: (w, { eq }) => eq(w.domain, domain),
        });
        websitesAddrs.domain;

        if (cache) {
          return cache;
        }

        const addr = await lookupPromise(domain);
        // save to db

        // await db
        //   .insert(websitesAddrs)
        //   .values({
        //     domain: domain,
        //     ip: addr,
        //     // id: 0,
        //     // createdAt: new Date(),
        //     // updatedAt: new Date(),
        //   })
        //   .execute();

        return {
          url: url,
          ip: addr,
        };
      } catch (err) {
        throw new TRPCError({
          message: `Could not find the website ${url}`,
          code: "BAD_REQUEST",
          cause: {
            url: url,
          },
        });
      }
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
