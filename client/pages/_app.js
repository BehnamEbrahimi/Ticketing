import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx); // info. fetching that is common for all pages.
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {}; // info. fetching for individual pages.
  if (appContext.Component.getInitialProps) {
    // if the page has getInitialProps
    pageProps = await appContext.Component.getInitialProps(appContext.ctx); // we manually call the getInitialProps of the component.
  }

  return { pageProps, ...data }; // data is an object with currentUser on it.
};

export default AppComponent;
