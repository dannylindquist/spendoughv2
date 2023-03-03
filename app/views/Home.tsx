import { MainLayout } from "./layout.jsx";

export const HomeView = () => {
  return (
    <MainLayout>
      <h1>I'm home!</h1>
      <p>{new Date().toDateString()}</p>
      <form action="/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </MainLayout>
  );
};
