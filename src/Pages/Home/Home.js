import React from "react";
import Footer from "../../Shared/Footer/Footer";
import AwardTable from "./Components/AwardTable/AwardTable";
import Banner from "./Components/Banner/Banner";
import ContactWithMe from "./Components/ContactWithMe/ContactWithMe";
import EducationAwardCarousel from "./Components/EducationCarousel/EducationCarousel";
import Header from "./Components/Header/Header";
import Latestproject from "./Components/Latestproject/Latestproject";

const Home = () => {
  return (
    <div>
     
        <Header></Header>
     
      <Banner></Banner>
      <Latestproject></Latestproject>
      <EducationAwardCarousel></EducationAwardCarousel>
      <ContactWithMe></ContactWithMe>
      <AwardTable></AwardTable>
      <Footer></Footer>
    </div>
  );
};

export default Home;
