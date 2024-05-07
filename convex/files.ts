import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const createFile = mutation({
    args: {
       name: v.string(),
    },
    async handler(ctx, args) {
//        const identity = await ctx.auth.getUserIdentity();
//
//        if(!identity) {
//            throw new ConvexError("Unauthorized");
//        }
        
        await ctx.db.insert("files", {
            name: args.name,
        })
    }
});

export const  getFiles = query({
    args: {},
    async handler(ctx, args) {
//        const identity = await ctx.auth.getUserIdentity();
//                
//        if(!identity) {
//           throw new ConvexError("Unauthorized");
//        }
//        
        return ctx.db.query("files").collect();
    }
});