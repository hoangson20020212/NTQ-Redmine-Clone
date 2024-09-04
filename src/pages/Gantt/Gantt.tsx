import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const Gantt = () => {
  const { name } = useParams();
  return (
    <>
      <Helmet>
        <title>{`Gantt - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      <h2>Gantt</h2>
    </>
  );
};

export default Gantt;
