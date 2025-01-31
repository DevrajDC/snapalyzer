import Footer from "@/components/footer";
import Header from "@/components/header";
import Main from "@/components/main";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <Main />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
