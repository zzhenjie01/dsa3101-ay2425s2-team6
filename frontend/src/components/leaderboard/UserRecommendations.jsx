import { useState, useRef, useEffect } from "react";
import { arc } from "d3-shape";
import * as d3 from "d3";
import logosFull from "@/assets/BankLogo/getLogoFull.js";
import logosPart from "@/assets/BankLogo/getLogoPart.js";

export default function UserRecommendations({
  companies,
  cdata,
  historicalData,
}) {
  const newData = transformData(cdata);
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const threshold = getThreshold(companies, cdata);
  const [isExpanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start w-screen h-[80dvh] pb-2 mt-1">
      <div className="relative w-[60%] h-[60vh] grid grid-cols-[3fr_2fr] items-start space-y-1 pb-5 mt-1  bg-gray">
        <div className="flex flex-col items-start pt-0">
          {/* HEADER for MEDALS ---------------------------------------------------------- */}
          <div className="w-full h-3 flex font-bold space-y-0 mb-2">
            {!isExpanded && (
              <div
                className="w-1/4 text-center relative text-gray-400 text-xs
                                before:absolute before:top-3/2 before:left-0 before:w-full before:h-[2px] before:bg-gray-400 leading-tight"
              >
                <span className="relative bg-white px-1">High</span>
                <br />
                <span className="relative bg-white px-1">Performer</span>
              </div>
            )}
          </div>

          {/* CONDITIONAL COMPANY SUMMARY -------------------------------------------------*/}
          {/* appears only when clicked */}

          {isExpanded && (
            <>
              <div
                className={`h-[350px] w-full border-3 border-r-0 
                                        border-[rgba(64,121,47,0.8)] bg-[rgba(0,64,255,0.05)] rounded-l-3xl mt-5`}
                onMouseOut={(event) => {
                  if (
                    !event.relatedTarget ||
                    !event.currentTarget.contains(event.relatedTarget)
                  ) {
                    setExpanded(null);
                  }
                }}
              >
                <CompanySummary company={isExpanded} alldata={historicalData} />
              </div>
            </>
          )}

          {/* ACTUAL COMPANY LIST ---------------------------------------------------------*/}
          <ul className="relative w-full items-end mr-2">
            {companies.map((company, index) => {
              const companyData = newData
                ? newData.find(
                    (companyData) => companyData.company_name === company
                  )
                : null;
              if (!companyData) return null;
              if (isExpanded) return null;

              // ------------------- UPON INITIALIZATION --------------------
              // ---------------------LISTS EVERYTHING -----------------------
              return (
                <li
                  key={index}
                  className="relative flex items-center space-x-3 w-full transition-all duration-300 group-hover:z-10"
                  onMouseEnter={() => setHoveredCompany(company)} // Set hovered company on hover
                  onMouseLeave={() => setHoveredCompany(null)} // Reset on hover leave
                >
                  <div
                    className={`absolute w-full flex flex-col gap-1 pointer-events-none  
                                ${
                                  hoveredCompany && hoveredCompany !== company
                                    ? "opacity-30 backdrop-blur-sm"
                                    : ""
                                }`}
                  >
                    <div className="w-1/4 h-[2px] bg-[#00850e] opacity-20"></div>
                    <div className="w-1/4 h-[2px] bg-[#ffb230] opacity-20"></div>
                    <div className="w-1/4 h-[2px] bg-[#f360e7] opacity-20"></div>
                  </div>
                  {/* First Column: Numbered Circle - Environment*/}
                  <div
                    className={`relative flex items-center justify-center mr-0
                                                    ${
                                                      hoveredCompany &&
                                                      hoveredCompany !== company
                                                        ? "opacity-30 backdrop-blur-sm"
                                                        : ""
                                                    }`}
                  >
                    <AwardWithLeaf
                      percentile={companyData.e_percentile}
                      threshold={threshold}
                    />
                  </div>

                  {/* First Column: Numbered Circle -Social */}
                  <div
                    className={`relative flex items-center justify-center mr-0
                                                    ${
                                                      hoveredCompany &&
                                                      hoveredCompany !== company
                                                        ? "opacity-30 backdrop-blur-sm"
                                                        : ""
                                                    }`}
                  >
                    {/* Overlapping SVG (Separate from the clipped div) */}
                    <AwardWithPerson
                      percentile={companyData.s_percentile}
                      threshold={threshold}
                    />
                  </div>

                  {/* First Column: Numbered Circle - Governance */}
                  <div
                    className={`relative flex items-center justify-center mr-0
                                                    ${
                                                      hoveredCompany &&
                                                      hoveredCompany !== company
                                                        ? "opacity-30 backdrop-blur-sm"
                                                        : ""
                                                    }`}
                  >
                    <AwardWithGavel
                      percentile={companyData.g_percentile}
                      threshold={threshold}
                    />
                  </div>

                  {/* Second Column: Main Row (Expanding) */}
                  <div
                    className={`relative w-[280px] h-[60px] border-4 border-emerald-700 text-black 
                                            font-semibold text-5xl flex items-center px-4 ml-6 mb-3 mt-3 rounded-xl hover:cursor-pointer
                                            transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]
                                            ${
                                              hoveredCompany &&
                                              hoveredCompany !== company
                                                ? "opacity-50 backdrop-blur-sm"
                                                : ""
                                            }`}
                    onClick={() => setExpanded(hoveredCompany)}
                  >
                    {/* Logo */}
                    <img
                      src={logosFull[company]}
                      alt={`${company} logo`}
                      className="w-12 h-12 absolute left-[30px]"
                      onError={(e) =>
                        (e.target.src =
                          "https://www.svgrepo.com/download/9509/bank.svg")
                      }
                    />

                    {/* Company Name */}
                    <span
                      className="absolute left-[90px]"
                      style={{ fontSize: "clamp(16px, 5vw, 20px)" }}
                    >
                      {company}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className=" flex flex-col h-[405px]">
          {/* Third Column: Expanding Data Area */}
          <Overview hoveredCompany={hoveredCompany} newData={newData} />
        </div>
      </div>
      <div className="w-[70%] text-[12px] text-gray-500 pt-10 text-right">
        *High Performers are based on your search profile and percentile
        performance against industry average
      </div>
    </div>
  );
}

function transformData(data) {
  // Function to compute percentile rank
  const getPercentileRank = (arr, value) => {
    return (arr.filter((x) => x < value).length / (arr.length - 1)) * 100;
  };

  // Extract each column and sort
  const environmentalScore = data
    .map((c) => c.environmentalScore)
    .sort((a, b) => a - b);
  const socialScore = data.map((c) => c.socialScore).sort((a, b) => a - b);
  const governanceScore = data
    .map((c) => c.governanceScore)
    .sort((a, b) => a - b);

  // Map the companies array to replace scores with percentiles
  const companiesWithPercentiles = data.map((company) => ({
    company_name: company.company,
    e_percentile: getPercentileRank(
      environmentalScore,
      company.environmentalScore
    ),
    s_percentile: getPercentileRank(socialScore, company.socialScore),
    g_percentile: getPercentileRank(governanceScore, company.governanceScore),
  }));

  return companiesWithPercentiles;
}

const AwardWithLeaf = ({ percentile, size = 12, threshold }) => {
  if (percentile < threshold) {
    return (
      <div
        className={`relative flex items-center justify-center w-${size} h-${size}`}
      ></div>
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center w-${size} h-${size}`}
    >
      {/* Award SVG - Background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        fill="none"
        viewBox="2.857 0.459 18.439 23.082"
      >
        <path
          stroke="#000"
          strokeWidth="0.5"
          fill="#d16e7f"
          fillRule="evenodd"
          d="m8.2 15.944-.3 1.514-.3 1.514-.3 1.514L7 22l1.147-.688 1.147-.688 1.147-.688 1.147-.689.1-.059a.967.967 0 0 1 .079-.044c.024-.012.045-.023.066-.031a.489.489 0 0 1 .4.031c.024.012.05.026.079.044l.1.059 1.179.65 1.179.65 1.179.65 1.179.65-.268-1.483-.268-1.482-.268-1.483-.268-1.483s-.679 1.037-1.35 1.082c-.698.046-2.745-.803-2.745-.803.005 0-1.443.591-2.675.777-.517.078-1.086-1.028-1.086-1.028Z"
        />
        <path
          stroke="#000"
          strokeWidth="0.5"
          fill="#ffe200"
          fillRule="evenodd"
          d="M16.426 4.249a1.519 1.519 0 0 0 .824.825l.327.135.327.136.328.136.327.135a1.497 1.497 0 0 1 .495.331 1.486 1.486 0 0 1 .33.495 1.46 1.46 0 0 1 .116.583 1.555 1.555 0 0 1-.116.583l-.135.327-.136.327-.135.327-.136.327a1.49 1.49 0 0 0-.116.584 1.547 1.547 0 0 0 .117.584l.135.326.135.327.136.327.135.327a1.387 1.387 0 0 1 .086.286 1.469 1.469 0 0 1-.036.741 1.387 1.387 0 0 1-.114.276 1.496 1.496 0 0 1-.378.46 1.365 1.365 0 0 1-.249.165 1.674 1.674 0 0 1-.135.065l-.327.135-.327.136-.327.135-.327.136a1.528 1.528 0 0 0-.494.33 1.492 1.492 0 0 0-.331.494l-.135.328-.136.327-.135.327-.136.327a1.565 1.565 0 0 1-.331.494 1.499 1.499 0 0 1-.782.418 1.478 1.478 0 0 1-.592 0 1.46 1.46 0 0 1-.287-.087l-.327-.135-.327-.136-.327-.135-.327-.136a1.554 1.554 0 0 0-1.166.001l-.327.136-.328.135-.327.135-.327.135a1.48 1.48 0 0 1-.583.116 1.547 1.547 0 0 1-.583-.116.773.773 0 0 1-.265-.205 2.122 2.122 0 0 1-.229-.329 4.617 4.617 0 0 1-.189-.37c-.055-.121-.102-.235-.141-.328l-.136-.225-.136-.226-.135-.225-.136-.226a1.533 1.533 0 0 0-.824-.825l-.327-.135-.328-.136-.327-.135-.327-.136a1.533 1.533 0 0 1-.912-1.112 1.555 1.555 0 0 1-.001-.592c.02-.098.049-.194.087-.287l.136-.327.135-.327.136-.327.135-.327c.039-.093.067-.19.086-.287a1.48 1.48 0 0 0 0-.593 1.502 1.502 0 0 0-.087-.287l-.135-.327-.136-.328-.135-.327-.135-.327a1.48 1.48 0 0 1-.087-.286 1.506 1.506 0 0 1 0-.596 1.688 1.688 0 0 1 .151-.422 1.473 1.473 0 0 1 .267-.358 1.53 1.53 0 0 1 .495-.331l.327-.135.326-.136.327-.135.327-.136a1.493 1.493 0 0 0 .683-.559c.056-.082.103-.171.142-.264l.136-.327.135-.328.136-.327.136-.327a1.6 1.6 0 0 1 .141-.265 1.597 1.597 0 0 1 .419-.418 1.533 1.533 0 0 1 1.144-.229c.097.019.194.048.287.087l.327.136.327.135.327.136.327.135c.094.039.19.067.288.086a1.47 1.47 0 0 0 .592 0 1.48 1.48 0 0 0 .287-.087l.327-.135.327-.135.328-.135.327-.135a1.502 1.502 0 0 1 .583-.116 1.557 1.557 0 0 1 .584.116 1.551 1.551 0 0 1 .494.33 1.553 1.553 0 0 1 .331.495l.136.328.135.327.136.327.135.327v-.002Z"
        />
      </svg>

      {/* Leaf SVG - Foreground (Shifted Up) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        viewBox="0 0 24 24"
        className="absolute w-7 h-7 top-[3px]"
      >
        <path
          stroke="#000"
          fill="#64ca5a"
          strokeWidth="1"
          d="M4.449 17.009C-.246 7.838 7.34.686 19.555 3.612a1.843 1.843 0 0 1 1.41 1.883c-.379 7.793-3.93 12.21-14.832 12.49a1.828 1.828 0 0 1-1.684-.976Z"
        />
        <path
          stroke="#000"
          fill="#64ca5a"
          strokeWidth="1"
          d="M4 21c1.5-5.5 2-8.5 8-11"
        />
      </svg>
    </div>
  );
};

const AwardWithPerson = ({ percentile, size = 12, threshold }) => {
  if (percentile < threshold) {
    return (
      <div
        className={`relative flex items-center justify-center w-${size} h-${size}`}
      ></div>
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center w-${size} h-${size}`}
    >
      {/* Award SVG - Background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        fill="none"
        viewBox="2.857 0.459 18.439 23.082"
      >
        <path
          stroke="#000"
          strokeWidth="0.5"
          fill="#d16e7f"
          fillRule="evenodd"
          d="m8.2 15.944-.3 1.514-.3 1.514-.3 1.514L7 22l1.147-.688 1.147-.688 1.147-.688 1.147-.689.1-.059a.967.967 0 0 1 .079-.044c.024-.012.045-.023.066-.031a.489.489 0 0 1 .4.031c.024.012.05.026.079.044l.1.059 1.179.65 1.179.65 1.179.65 1.179.65-.268-1.483-.268-1.482-.268-1.483-.268-1.483s-.679 1.037-1.35 1.082c-.698.046-2.745-.803-2.745-.803.005 0-1.443.591-2.675.777-.517.078-1.086-1.028-1.086-1.028Z"
        />
        <path
          stroke="#000"
          strokeWidth="0.5"
          fill="#ffe200"
          fillRule="evenodd"
          d="M16.426 4.249a1.519 1.519 0 0 0 .824.825l.327.135.327.136.328.136.327.135a1.497 1.497 0 0 1 .495.331 1.486 1.486 0 0 1 .33.495 1.46 1.46 0 0 1 .116.583 1.555 1.555 0 0 1-.116.583l-.135.327-.136.327-.135.327-.136.327a1.49 1.49 0 0 0-.116.584 1.547 1.547 0 0 0 .117.584l.135.326.135.327.136.327.135.327a1.387 1.387 0 0 1 .086.286 1.469 1.469 0 0 1-.036.741 1.387 1.387 0 0 1-.114.276 1.496 1.496 0 0 1-.378.46 1.365 1.365 0 0 1-.249.165 1.674 1.674 0 0 1-.135.065l-.327.135-.327.136-.327.135-.327.136a1.528 1.528 0 0 0-.494.33 1.492 1.492 0 0 0-.331.494l-.135.328-.136.327-.135.327-.136.327a1.565 1.565 0 0 1-.331.494 1.499 1.499 0 0 1-.782.418 1.478 1.478 0 0 1-.592 0 1.46 1.46 0 0 1-.287-.087l-.327-.135-.327-.136-.327-.135-.327-.136a1.554 1.554 0 0 0-1.166.001l-.327.136-.328.135-.327.135-.327.135a1.48 1.48 0 0 1-.583.116 1.547 1.547 0 0 1-.583-.116.773.773 0 0 1-.265-.205 2.122 2.122 0 0 1-.229-.329 4.617 4.617 0 0 1-.189-.37c-.055-.121-.102-.235-.141-.328l-.136-.225-.136-.226-.135-.225-.136-.226a1.533 1.533 0 0 0-.824-.825l-.327-.135-.328-.136-.327-.135-.327-.136a1.533 1.533 0 0 1-.912-1.112 1.555 1.555 0 0 1-.001-.592c.02-.098.049-.194.087-.287l.136-.327.135-.327.136-.327.135-.327c.039-.093.067-.19.086-.287a1.48 1.48 0 0 0 0-.593 1.502 1.502 0 0 0-.087-.287l-.135-.327-.136-.328-.135-.327-.135-.327a1.48 1.48 0 0 1-.087-.286 1.506 1.506 0 0 1 0-.596 1.688 1.688 0 0 1 .151-.422 1.473 1.473 0 0 1 .267-.358 1.53 1.53 0 0 1 .495-.331l.327-.135.326-.136.327-.135.327-.136a1.493 1.493 0 0 0 .683-.559c.056-.082.103-.171.142-.264l.136-.327.135-.328.136-.327.136-.327a1.6 1.6 0 0 1 .141-.265 1.597 1.597 0 0 1 .419-.418 1.533 1.533 0 0 1 1.144-.229c.097.019.194.048.287.087l.327.136.327.135.327.136.327.135c.094.039.19.067.288.086a1.47 1.47 0 0 0 .592 0 1.48 1.48 0 0 0 .287-.087l.327-.135.327-.135.328-.135.327-.135a1.502 1.502 0 0 1 .583-.116 1.557 1.557 0 0 1 .584.116 1.551 1.551 0 0 1 .494.33 1.553 1.553 0 0 1 .331.495l.136.328.135.327.136.327.135.327v-.002Z"
        />
      </svg>

      {/* Person SVG - Foreground (Shifted Up) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        fill="none"
        stroke="#000"
        strokeWidth="3"
        viewBox="0 0 64 64"
        className="absolute w-7 h-7 top-[2px]"
      >
        <circle fill="#ff997b" cx="32" cy="18.14" r="11.14" />
        <path
          fill="#ff997b"
          d="M54.55 56.85A22.55 22.55 0 0 0 32 34.3 22.55 22.55 0 0 0 9.45 56.85Z"
        />
      </svg>
    </div>
  );
};

const AwardWithGavel = ({ percentile, size = 12, threshold }) => {
  if (percentile < threshold) {
    return (
      <div
        className={`relative flex items-center justify-center w-${size} h-${size}`}
      ></div>
    );
  }
  return (
    <div
      className={`relative flex items-center justify-center w-${size} h-${size}`}
    >
      {/* Award SVG - Background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        fill="none"
        viewBox="2.857 0.459 18.439 23.082"
      >
        <path
          stroke="#000"
          strokeWidth="0.5"
          fill="#d16e7f"
          fillRule="evenodd"
          d="m8.2 15.944-.3 1.514-.3 1.514-.3 1.514L7 22l1.147-.688 1.147-.688 1.147-.688 1.147-.689.1-.059a.967.967 0 0 1 .079-.044c.024-.012.045-.023.066-.031a.489.489 0 0 1 .4.031c.024.012.05.026.079.044l.1.059 1.179.65 1.179.65 1.179.65 1.179.65-.268-1.483-.268-1.482-.268-1.483-.268-1.483s-.679 1.037-1.35 1.082c-.698.046-2.745-.803-2.745-.803.005 0-1.443.591-2.675.777-.517.078-1.086-1.028-1.086-1.028Z"
        />
        <path
          stroke="#000"
          strokeWidth="0.5"
          fill="#ffe200"
          fillRule="evenodd"
          d="M16.426 4.249a1.519 1.519 0 0 0 .824.825l.327.135.327.136.328.136.327.135a1.497 1.497 0 0 1 .495.331 1.486 1.486 0 0 1 .33.495 1.46 1.46 0 0 1 .116.583 1.555 1.555 0 0 1-.116.583l-.135.327-.136.327-.135.327-.136.327a1.49 1.49 0 0 0-.116.584 1.547 1.547 0 0 0 .117.584l.135.326.135.327.136.327.135.327a1.387 1.387 0 0 1 .086.286 1.469 1.469 0 0 1-.036.741 1.387 1.387 0 0 1-.114.276 1.496 1.496 0 0 1-.378.46 1.365 1.365 0 0 1-.249.165 1.674 1.674 0 0 1-.135.065l-.327.135-.327.136-.327.135-.327.136a1.528 1.528 0 0 0-.494.33 1.492 1.492 0 0 0-.331.494l-.135.328-.136.327-.135.327-.136.327a1.565 1.565 0 0 1-.331.494 1.499 1.499 0 0 1-.782.418 1.478 1.478 0 0 1-.592 0 1.46 1.46 0 0 1-.287-.087l-.327-.135-.327-.136-.327-.135-.327-.136a1.554 1.554 0 0 0-1.166.001l-.327.136-.328.135-.327.135-.327.135a1.48 1.48 0 0 1-.583.116 1.547 1.547 0 0 1-.583-.116.773.773 0 0 1-.265-.205 2.122 2.122 0 0 1-.229-.329 4.617 4.617 0 0 1-.189-.37c-.055-.121-.102-.235-.141-.328l-.136-.225-.136-.226-.135-.225-.136-.226a1.533 1.533 0 0 0-.824-.825l-.327-.135-.328-.136-.327-.135-.327-.136a1.533 1.533 0 0 1-.912-1.112 1.555 1.555 0 0 1-.001-.592c.02-.098.049-.194.087-.287l.136-.327.135-.327.136-.327.135-.327c.039-.093.067-.19.086-.287a1.48 1.48 0 0 0 0-.593 1.502 1.502 0 0 0-.087-.287l-.135-.327-.136-.328-.135-.327-.135-.327a1.48 1.48 0 0 1-.087-.286 1.506 1.506 0 0 1 0-.596 1.688 1.688 0 0 1 .151-.422 1.473 1.473 0 0 1 .267-.358 1.53 1.53 0 0 1 .495-.331l.327-.135.326-.136.327-.135.327-.136a1.493 1.493 0 0 0 .683-.559c.056-.082.103-.171.142-.264l.136-.327.135-.328.136-.327.136-.327a1.6 1.6 0 0 1 .141-.265 1.597 1.597 0 0 1 .419-.418 1.533 1.533 0 0 1 1.144-.229c.097.019.194.048.287.087l.327.136.327.135.327.136.327.135c.094.039.19.067.288.086a1.47 1.47 0 0 0 .592 0 1.48 1.48 0 0 0 .287-.087l.327-.135.327-.135.328-.135.327-.135a1.502 1.502 0 0 1 .583-.116 1.557 1.557 0 0 1 .584.116 1.551 1.551 0 0 1 .494.33 1.553 1.553 0 0 1 .331.495l.136.328.135.327.136.327.135.327v-.002Z"
        />
      </svg>

      {/* Gavel SVG - Foreground (Shifted Up) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="800"
        height="800"
        viewBox="0 0 36 36"
        className="absolute w-7 h-7 top-[1px]"
      >
        <path
          fill="purple"
          d="M23.7 10.79a1 1 0 0 1-.71-.3l-7.43-7.43A1 1 0 0 1 17 1.65l7.44 7.43a1 1 0 0 1 0 1.41 1 1 0 0 1-.74.3ZM10.69 23.79a1 1 0 0 1-.7-.29l-7.44-7.43A1 1 0 1 1 4 14.65l7.43 7.43a1 1 0 0 1-.71 1.71ZM20.64 31l.5 1.77a.89.89 0 0 1-.85 1.12H3.67a.89.89 0 0 1-.85-1.12L3.33 31a1.51 1.51 0 0 1 1.47-1.08h14.36A1.53 1.53 0 0 1 20.64 31ZM32.19 28.08 18.43 14.46l3-3-6.91-6.96-8.94 8.94 6.93 6.94 3.21-3.2 13.74 13.6a1.89 1.89 0 0 0 1.36.56 1.91 1.91 0 0 0 1.37-3.26Z"
        />
        <path fill="none" d="M0 0h36v36H0z" />
      </svg>
    </div>
  );
};

function getThreshold(companyData, allData) {
  // This functions finds the best threshold to give just enough medals to the list of recommended companies

  const transData = transformData(allData); //converts scores to percentile
  const filteredData = transData.filter((item) =>
    companyData.includes(item.company_name)
  );
  const percentiles = filteredData.flatMap((item) => [
    item.e_percentile,
    item.s_percentile,
    item.g_percentile,
  ]);

  percentiles.sort((a, b) => a - b);

  const percentileIndex = Math.floor(0.7 * (percentiles.length - 1));
  return percentiles[percentileIndex];
}

const Overview = ({ hoveredCompany, newData }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  if (hoveredCompany === null) {
    return (
      <div className="w-full h-135 top-5 bottom-0 w-80 bg-gray pb-5"></div>
    );
  }
  const companyData = newData
    ? newData.find((companyData) => companyData.company_name === hoveredCompany)
    : null;
  return (
    <div
      className="w-full h-full top-5 w-80 border-3 
                                    border-[rgba(64,121,47,0.8)] bg-white rounded-3xl mt-3 overflow-auto"
    >
      {/* Placeholder for graphs/data */}
      <div className="h-full flex flex-col items-center justify-start px-4 ">
        <img
          src={logosPart[hoveredCompany]}
          alt={`${hoveredCompany} logo`}
          className="h-40 object-contain"
          onError={(e) =>
            (e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/b/b8/Banco_Santander_Logotipo.svg")
          }
        />

        <div className="w-full flex h-40 items-center justify-center">
          <CircularArcEco
            startAngle={15}
            endAngle={345}
            radius={42}
            strokeColor={"green"}
            percent={companyData.e_percentile}
          />
          <CircularArcSoc
            startAngle={15}
            endAngle={345}
            radius={42}
            strokeColor={"#e7812c"}
            percent={companyData.s_percentile}
          />
        </div>

        <div className="w-full flex h-40 items-center justify-center">
          <CircularArcGov
            startAngle={15}
            endAngle={345}
            radius={42}
            strokeColor={"purple"}
            percent={companyData.g_percentile}
          />
        </div>
      </div>
    </div>
  );
};

const CircularArcEco = ({
  startAngle,
  endAngle,
  radius,
  strokeColor,
  percent,
}) => {
  var percentile;
  if (percent >= 100) {
    percentile = 99;
  } else if (percent <= 0) {
    percentile = 1;
  } else {
    percentile = percent;
  }

  const circleConst = arc()
    .innerRadius(radius)
    .outerRadius(radius)
    .startAngle(-(15 * Math.PI) / 180) // Convert degrees to radians
    .endAngle(-(345 * Math.PI) / 180);

  const createArc = arc()
    .innerRadius(radius)
    .outerRadius(radius)
    .startAngle(-(startAngle * Math.PI) / 180) // Convert degrees to radians
    .endAngle(-(endAngle * Math.PI * percentile) / 18000);

  return (
    <svg width="100" height="100" viewBox="-50 -50 100 100">
      <path
        d={circleConst()}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {percentile > 5 && (
        <path
          d={createArc()}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
        />
      )}
      <g transform={`translate(-8, ${-1.25 * radius}) scale(${0.5})`}>
        <path
          d="M29.555 2.843a.751.751 0 0 0-.565-.546l-.005-.001a.756.756 0 0 0-.743.265l-.001.001a14.022 14.022 0 0 1-6.462 4.32l-.099.027c-1.693.552-3.662.946-5.697 1.103l-.088.005c-2.231.083-4.325.58-6.236 1.417l.11-.043c-3.3 1.788-5.502 5.225-5.502 9.176l.002.186v-.009c.009.303.03.602.064.9.154 1.198.484 2.285.966 3.285l-.028-.064a29.629 29.629 0 0 0-3.886 6.67l-.073.197a.75.75 0 0 0 1.378.595l.002-.005c.964-2.307 2.092-4.294 3.425-6.123l-.059.085a11.11 11.11 0 0 0 4.567 4.021l.067.029a11.695 11.695 0 0 0 4.833 1.028h.079-.004a13.865 13.865 0 0 0 5.324-1.081l-.092.034c5.262-2.385 9.002-7.306 9.678-13.16l.007-.077a29.82 29.82 0 0 0 .231-3.762c0-3.018-.436-5.935-1.247-8.69l.055.217zm-.524 12.012a15.05 15.05 0 0 1-8.674 12.03l-.094.038a11.212 11.212 0 0 1-4.528.939c-1.599 0-3.121-.329-4.501-.924l.074.028a9.636 9.636 0 0 1-4.242-3.864l-.024-.045c3.317-3.812 7.63-5.711 13.801-6.312a.75.75 0 0 0-.148-1.493h.003a21.076 21.076 0 0 0-14.343 6.343l-.004.004a8.752 8.752 0 0 1-.526-2.083l-.005-.045a8.618 8.618 0 0 1-.057-.934 8.852 8.852 0 0 1 4.623-7.78l.046-.023c1.65-.708 3.565-1.152 5.575-1.225l.028-.001a27.183 27.183 0 0 0 6.313-1.232l-.192.054a16.294 16.294 0 0 0 6.279-3.744l-.006.005c.523 2.02.823 4.338.823 6.727 0 1.247-.082 2.475-.24 3.678l.015-.142z"
          fill="green"
          stroke="green"
          strokeWidth="1"
        />
      </g>
      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle">
        <tspan x="0" dy="-20" fontSize="10" fill="gray">
          Top
        </tspan>
        <tspan x="0" dy="25" fontSize="36" fill="green">
          {100 - Math.round(percentile)}
        </tspan>
        <tspan dy="4" fontSize="20" fill="green">
          %
        </tspan>
      </text>
    </svg>
  );
};

const CircularArcSoc = ({
  startAngle,
  endAngle,
  radius,
  strokeColor,
  percent,
}) => {
  var percentile;
  if (percent >= 100) {
    percentile = 99;
  } else if (percent <= 0) {
    percentile = 1;
  } else {
    percentile = percent;
  }

  const circleConst = arc()
    .innerRadius(radius)
    .outerRadius(radius)
    .startAngle(-(15 * Math.PI) / 180) // Convert degrees to radians
    .endAngle(-(345 * Math.PI) / 180);

  const createArc = arc()
    .innerRadius(radius)
    .outerRadius(radius)
    .startAngle(-(startAngle * Math.PI) / 180) // Convert degrees to radians
    .endAngle(-(endAngle * Math.PI * percentile) / 18000);

  return (
    <svg width="100" height="100" viewBox="-50 -50 100 100">
      <path
        d={circleConst()}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {percentile > 5 && (
        <path
          d={createArc()}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
        />
      )}
      <g transform={`translate(-10, ${-1.25 * radius}) scale(${0.3})`}>
        <circle cx="32" cy="18.14" r="11.14" fill="#e7812c" stroke="#e7812c" />
        <path
          d="M54.55 56.85A22.55 22.55 0 0 0 32 34.3 22.55 22.55 0 0 0 9.45 56.85Z"
          fill="#e7812c"
          stroke="#e7812c"
          strokeWidth="1"
        />
      </g>
      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle">
        <tspan x="0" dy="-20" fontSize="10" fill="gray">
          Top
        </tspan>
        <tspan x="0" dy="25" fontSize="36" fill="#e7812c">
          {100 - Math.round(percentile)}
        </tspan>
        <tspan dy="4" fontSize="20" fill="#e7812c">
          %
        </tspan>
      </text>
    </svg>
  );
};

const CircularArcGov = ({
  startAngle,
  endAngle,
  radius,
  strokeColor,
  percent,
}) => {
  var percentile;
  if (percent >= 100) {
    percentile = 99;
  } else if (percent <= 0) {
    percentile = 1;
  } else {
    percentile = percent;
  }

  const circleConst = arc()
    .innerRadius(radius)
    .outerRadius(radius)
    .startAngle(-(15 * Math.PI) / 180) // Convert degrees to radians
    .endAngle(-(345 * Math.PI) / 180);

  const createArc = arc()
    .innerRadius(radius)
    .outerRadius(radius)
    .startAngle(-(startAngle * Math.PI) / 180) // Convert degrees to radians
    .endAngle(-(endAngle * Math.PI * percentile) / 18000);

  return (
    <svg width="100" height="100" viewBox="-50 -50 100 100">
      <path
        d={circleConst()}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
      />
      {percentile > 5 && (
        <path
          d={createArc()}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
        />
      )}
      <g transform={`translate(-10, ${-1.25 * radius}) scale(${0.6})`}>
        <path
          d="M23.7 10.41a1 1 0 0 1-.71-.29l-7.43-7.43A1 1 0 0 1 17 1.28l7.44 7.43a1 1 0 0 1-.71 1.7ZM11.86 22.25a1 1 0 0 0-.29-.71l-7.43-7.43a1 1 0 0 0-1.42 1.42L10.15 23a1 1 0 0 0 1.42 0 1 1 0 0 0 .29-.75ZM21.93 34H3a1 1 0 0 1-1-1.27l1.13-4a1 1 0 0 1 1-.73H20.8a1 1 0 0 1 1 .73l1.13 4a1 1 0 0 1-.17.87 1 1 0 0 1-.83.4ZM4.31 32H20.6l-.6-2H4.87ZM33.11 27.44l-14-14 2.36-2.36-6.95-6.95-8.94 8.94L12.51 20l2.35-2.34 14 14a3 3 0 0 0 4.24 0 3 3 0 0 0 .01-4.22ZM8.4 13.07 14.52 7l4.11 4.11-6.12 6.11Zm23.29 17.2a1 1 0 0 1-1.41 0l-14-14 1.41-1.41 14 14a1 1 0 0 1 0 1.41Z"
          fill="purple"
          stroke="purple"
        />
        <path fill="none" d="M0 0h36v36H0z" />
      </g>
      <text x="0" y="0" textAnchor="middle" dominantBaseline="middle">
        <tspan x="0" dy="-20" fontSize="10" fill="gray">
          Top
        </tspan>
        <tspan x="0" dy="25" fontSize="36" fill="purple">
          {100 - Math.round(percentile)}
        </tspan>
        <tspan dy="4" fontSize="20" fill="purple">
          %
        </tspan>
      </text>
    </svg>
  );
};

const CompanySummary = ({ company, alldata }) => {
  const companyData = alldata
    ? alldata.find((companyData) => companyData.name === company)
    : null;
  const esgData = Object.entries(companyData.leaderboard).map(
    ([year, scores]) => ({
      year: parseInt(year), // Convert year string to number
      environmental: scores.environmentalScore,
      social: scores.socialScore,
      governance: scores.governanceScore,
    })
  );
  esgData.sort((a, b) => a.year - b.year);
  const oldest = esgData[0];
  const recent = esgData[esgData.length - 1];

  // Time frame (years difference)
  const timeFrame = recent.year - oldest.year;

  // Calculate average changes per year
  const avgChange = {
    environmental: (
      ((recent.environmental - oldest.environmental) /
        (timeFrame * oldest.environmental)) *
      100
    ).toFixed(1),
    social: (
      ((recent.social - oldest.social) / (timeFrame * oldest.environmental)) *
      100
    ).toFixed(1),
    governance: (
      ((recent.governance - oldest.governance) /
        (timeFrame * oldest.environmental)) *
      100
    ).toFixed(1),
  };

  return (
    <div className="flex">
      <div className="w-[30%]">
        {/*Main Header ---------------------- */}
        <div className="font-sans font-extrabold text-[clamp(10px,5vw,30px)] tracking-wide text-gray-500 mt-2 ml-3 w-fit truncate">
          Trends
        </div>

        {/*Stock ---------------------------- */}
        <div className="font-sans font-bold text-[clamp(10px,5vw,15px)] w-fit tracking-wide text-gray-400 ml-3 mt-3">
          Stock Price
        </div>
        <div className="font-sans font-bold text-[clamp(10px,5vw,20px)] tracking-wide text-gray-900 ml-3 mt-0">
          $
          {
            companyData.forecast["Existing Data"][
              companyData.forecast["Existing Data"].length - 1
            ].value
          }
        </div>

        {/*ESG Change ----------------------- */}
        <div className="font-sans font-bold text-[clamp(10px,5vw,15px)] tracking-wide text-gray-400 ml-3 mt-3">
          Ave Change
        </div>

        {/* Environment--------- */}
        <div className="flex h-3 ml-2">
          <div className="flex-[1] border-b border-gray-500"></div>
          <div className="flex-[1]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="600"
              height="600"
              viewBox="0 0 24 24"
              className="relative w-6 h-6 left-2"
            >
              <path
                stroke="#000"
                fill="#64ca5a"
                strokeWidth="1"
                d="M4.449 17.009C-.246 7.838 7.34.686 19.555 3.612a1.843 1.843 0 0 1 1.41 1.883c-.379 7.793-3.93 12.21-14.832 12.49a1.828 1.828 0 0 1-1.684-.976Z"
              />
              <path
                stroke="#000"
                fill="#64ca5a"
                strokeWidth="1"
                d="M4 21c1.5-5.5 2-8.5 8-11"
              />
            </svg>
          </div>
          <div className="flex-[1] border-b border-gray-500"></div>
        </div>
        {/*Actual number*/}
        <div
          className={`font-sans font-bold text-[clamp(20px,5vw,30px)] tracking-wide ml-3 mt-0 mb-2
                    ${
                      avgChange.environmental > 0
                        ? "text-[#14aa00]"
                        : "text-[#d51600]"
                    }`}
        >
          {avgChange.environmental}%
        </div>

        {/* Social----------------- */}
        <div className="flex h-3 ml-2">
          <div className="flex-[1] border-b border-gray-500"></div>
          <div className="flex-[1]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="600"
              height="600"
              fill="none"
              stroke="#000"
              strokeWidth="3"
              viewBox="0 0 64 64"
              className="relative w-6 h-6 left-2 -top-1"
            >
              <circle fill="#ff997b" cx="32" cy="18.14" r="11.14" />
              <path
                fill="#ff997b"
                d="M54.55 56.85A22.55 22.55 0 0 0 32 34.3 22.55 22.55 0 0 0 9.45 56.85Z"
              />
            </svg>
          </div>
          <div className="flex-[1] border-b border-gray-500"></div>
        </div>
        {/*Actual number*/}
        <div
          className={`font-sans font-bold text-[clamp(20px,5vw,30px)] tracking-wide ml-3 mt-1 mb-1
                    ${
                      avgChange.social > 0 ? "text-[#14aa00]" : "text-[#d51600]"
                    }`}
        >
          {avgChange.social}%
        </div>

        {/* Governance ----------------- */}
        <div className="flex h-3 ml-2">
          <div className="flex-[1] border-b border-gray-500"></div>
          <div className="flex-[1]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="600"
              height="600"
              viewBox="0 0 36 36"
              className="relative w-6 h-6 left-2 -top-1"
            >
              <path
                fill="purple"
                d="M23.7 10.79a1 1 0 0 1-.71-.3l-7.43-7.43A1 1 0 0 1 17 1.65l7.44 7.43a1 1 0 0 1 0 1.41 1 1 0 0 1-.74.3ZM10.69 23.79a1 1 0 0 1-.7-.29l-7.44-7.43A1 1 0 1 1 4 14.65l7.43 7.43a1 1 0 0 1-.71 1.71ZM20.64 31l.5 1.77a.89.89 0 0 1-.85 1.12H3.67a.89.89 0 0 1-.85-1.12L3.33 31a1.51 1.51 0 0 1 1.47-1.08h14.36A1.53 1.53 0 0 1 20.64 31ZM32.19 28.08 18.43 14.46l3-3-6.91-6.96-8.94 8.94 6.93 6.94 3.21-3.2 13.74 13.6a1.89 1.89 0 0 0 1.36.56 1.91 1.91 0 0 0 1.37-3.26Z"
              />
              <path fill="none" d="M0 0h36v36H0z" />
            </svg>
          </div>
          <div className="flex-[1] border-b border-gray-500"></div>
        </div>
        {/*Actual number*/}
        <div
          className={`font-sans font-bold text-[clamp(20px,5vw,30px)] tracking-wide ml-3 mt-2 mb-2
                    ${
                      avgChange.governance > 0
                        ? "text-[#14aa00]"
                        : "text-[#d51600]"
                    }`}
        >
          {avgChange.governance}%
        </div>
      </div>

      <div className="w-[70%] flex flex-col justify-center ml-4">
        <div>
          <StreamGraph data={esgData} />
        </div>
        <a
          href="/dashboard"
          className="w-full flex gap-2 px-4 py-2 bg-gray-200 text-gray-500 justify-center items-center h-[28px]  
                                rounded-[20px] shadow-md hover:bg-gray-500 hover:text-white transition-all"
        >
          <span>Dashboard</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const StreamGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 10, bottom: 20, left: 40 };
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove(); // Fix duplicate renders

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.year))
      .range([0, width - margin.right])
      .padding(0);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) => d.environmental + d.social + d.governance),
      ])
      .nice()
      .range([height, 0]);

    // Enforce correct stack order: Governance at the bottom, Environmental at the top
    const keys = ["governance", "social", "environmental"];
    const stack = d3.stack().keys(keys);
    const series = stack(data);

    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#cca2fa", "#facba2", "#56c454"]);

    const Tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("opacity", 0)
      .style("pointer-events", "none"); // Fix: Prevents tooltip from interfering

    // Mouse events
    const mouseover = function (event, d) {
      Tooltip.style("opacity", 1);
      d3.selectAll(".layer").style("opacity", 0.4);
      d3.select(this).style("opacity", 1);
    };

    const mousemove = function (event, d) {
      Tooltip.html(d.key)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    };

    const mouseleave = function (event, d) {
      if (
        !event.relatedTarget ||
        !event.relatedTarget.classList.contains("layer")
      ) {
        // Only fade back if mouse is really leaving the graph, not moving between layers
        Tooltip.style("opacity", 0);
        d3.selectAll(".layer").style("opacity", 1);
      }
    };

    svg
      .selectAll(".layer")
      .data(series)
      .enter()
      .append("path")
      .attr("class", "layer")
      .attr(
        "d",
        d3
          .area()
          .x((d) => xScale(d.data.year) + xScale.bandwidth() / 2)
          .y0((d) => yScale(d[0]))
          .y1((d) => yScale(d[1]))
          .curve(d3.curveBasis)
      )
      .attr("fill", (d) => color(d.key))
      .attr("stroke", "black") // Always has black outline
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave); // FIX: Attach only to `.layer`

    svg
      .append("g")
      .attr("transform", `translate(0, ${height + 5})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#555");

    svg.select(".domain").remove();

    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(-width))
      .selectAll("text")
      .style("font-family", "Arial, sans-serif")
      .style("font-size", "12px")
      .style("fill", "#c6c6c6");

    svg
      .selectAll(".tick line")
      .attr("stroke", "#c6c6c6")
      .attr("stroke-dasharray", "2,2")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.5);

    svg
      .append("text")
      .attr("x", width / 2) // Center horizontally
      .attr("y", 10) // Position slightly above
      .attr("text-anchor", "middle") // Align center
      .style("font-size", "16px") // Adjust font size
      .style("font-weight", "bold") // Make it bold
      .style("fill", "#666") // Dark gray color
      .text("ESG over Time"); // Your title text

    svg.select(".domain").remove();
  }, [data]);

  return <svg ref={svgRef}></svg>;
};
