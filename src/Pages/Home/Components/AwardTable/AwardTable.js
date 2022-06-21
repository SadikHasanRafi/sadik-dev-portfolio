import React from "react";
import "./AwardTable.css"

const AwardTable = () => {
  return (
    <div className="m-20">

        <div>
            <p className="text-accent font-extrabold text-center text-5xl m-10 ">Education & Certifications</p>
        </div>

      <div class=" w-full table-normal">
        <div class="">
          <table class="w-full  hover:shadow-lg shadow-md rounded-2xl my-8 text-center">
            <thead >
              <tr >
                <th  className=" bg-primary text-accent font-extrabold text-lg normal-case" >Year</th>
                <th className=" bg-primary text-accent font-extrabold text-lg normal-case" >Degree or Certificates</th>
                <th className=" bg-primary text-accent font-extrabold text-lg normal-case" >Institution or University</th>
              </tr>
            </thead>
            <tbody className=" text-accent">
              <tr>
                <td>2019 - Present</td>
                <td>B.Sc in CSE</td>
                <td>Daffodil International University</td>
              </tr>
              <tr>
                <td >2021 - 2022</td>
                <td>Complete web development course with Jhankar Mahbub</td>
                <td>Programming Hero</td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AwardTable;
