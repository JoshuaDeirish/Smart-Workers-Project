import { useRouteError } from "react-router-dom";
import Nav from "./components/nav";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" style={{padding:"200px 60px 300px 60px", backgroundColor:"#F5F5F5"}}>
      <h1 style={{fontSize:40}}>Oops!</h1>
      <p style={{fontSize:40}}>Sorry, an unexpected error has occurred.</p>
      <p style={{fontSize:30}}>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}