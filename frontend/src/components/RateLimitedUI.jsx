import { ZapIcon } from "lucide-react"

function RateLimitedUI() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl shadow-lg backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center p-6">
                <div className="flex-shrink-0 bg-yellow-500/20 p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                    <ZapIcon className="w-10 h-10 text-yellow-400"/>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Rate Limit Reached</h3>
                    <p className="text-gray-300 mb-1">
                        You've made too many requests in a short period. Please wait a moment.
                    </p>
                    <p className="text-sm text-gray-500">
                        Try again in a few seconds for the best experience.
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RateLimitedUI;