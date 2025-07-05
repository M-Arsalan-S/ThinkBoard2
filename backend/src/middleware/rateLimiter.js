import ratelimit from "../config/upstash.js";
// done per user - usually we use userid in place of my-rate-limit. We are not using that since we don't have user key here
const  rateLimiter = async (req,res,next) => {
    try {
        const {success} = await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message: "Too many requests, please try again later"
            });
        }

        next();

    } catch (error) {
        console.log("Rate limit error:",error);
        next(error);
    }
}

export default rateLimiter;``