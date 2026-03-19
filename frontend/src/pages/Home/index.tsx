import Navbar from "../../components/layout/navbar";
import Sidebar from "../../components/layout/sidebar";

const Home = () => {

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">
        
      </main>
    </div>
  );
};

export default Home;
