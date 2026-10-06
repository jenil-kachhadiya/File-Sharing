import { FiUpload, FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-100">

      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-5">
        File Sharing
      </h1> 

      <DotLottieReact
        src="/file-transfer.lottie"
        loop
        autoplay
        style={{
          width: "400px",
          height: "300px",
        }}
      />

      <div className="flex flex-col sm:flex-row gap-10">
        <button
          onClick={()=> navigate("/root")}
          className="w-48 py-4 flex items-center justify-center gap-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700">
          <FiUpload size={22} />
          Send File
        </button>

        <button 
        onClick={()=> navigate("/receive")}
        className="w-48 py-4 flex items-center justify-center gap-3 rounded-xl bg-red-500 text-white font-semibold shadow-red-200 shadow-lg hover:bg-red-700">
          <FiDownload size={22} />
          Receive File
        </button>
      </div>

    </div>
  );
};

export default Home;