import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx); // info. fetching that is common for all pages.
  //const { data } = await client.get("/api/users/currentuser");
  const data = {
    currentUser: {
        id: "5f1be4c9636208001837d6c0",
        email: "test@test.com"
    }
};

  let pageProps = {}; // info. fetching for individual pages.
  if (appContext.Component.getInitialProps) {
    // if the page has getInitialProps
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); // we manually call the getInitialProps of the component. 
    // We also pass the axios client so that we don't need to import it anytime we need to make a request for each page.
    // We also pass the currentUser so that we have access to the current user in each page's getInitialProps.
  }

  return { pageProps, ...data }; // data is an object with currentUser on it.
};

export default AppComponent;
