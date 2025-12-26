import '../css/App.css'
import ComingSoon from './ComingSoon'
import { Analytics } from "@vercel/analytics/next"
function App() {

  return (
    <>
     <ComingSoon />
      <Analytics />
    </>
  )
}

export default App
