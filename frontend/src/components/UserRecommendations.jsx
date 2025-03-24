import { useState } from 'react';
import { arc } from "d3-shape";
export default function UserRecommendations({ companies, cdata}) {

    const newData = transformData(cdata);
    const [hoveredCompany, setHoveredCompany] = useState(null);


    return (
        <div className="flex items-center justify-center w-screen">
            <div className="relative w-[700px] flex flex-col items-center space-y-4 pb-20 group">
                <ul className="relative w-full">
                    {companies.map((company, index) => {
                        const logoUrl = getPartialLogo(company);
                        const companyData = newData ? newData.find(companyData => companyData.company_name === company) : null;

                        return (
                            <li
                                key={index}
                                className="relative flex items-center space-x-3 w-full transition-all duration-300 group-hover:z-10"
                                onMouseEnter={() => setHoveredCompany(company)} // Set hovered company on hover
                                onMouseLeave={() => setHoveredCompany(null)} // Reset on hover leave
                            >
                                {/* First Column: Numbered Circle - Environment*/}
                                <div className="relative flex items-center justify-center mr-0">
                                    <AwardWithLeaf percentile={companyData.e_percentile} />
                                </div>

                                {/* First Column: Numbered Circle -Social */}
                                <div className="relative flex flex-col items-center mr-0">
                                    {/* Overlapping SVG (Separate from the clipped div) */}
                                    <AwardWithPerson percentile={companyData.s_percentile} />

                                </div>

                                {/* First Column: Numbered Circle - Governance */}
                                <div className="relative flex flex-col items-center">
                                    <AwardWithGavel percentile={companyData.g_percentile} />
                                </div>

                                {/* Second Column: Main Row (Expanding) */}
                                <div className="relative w-[280px] h-[60px] border-4 border-emerald-700 text-black 
                                            font-semibold text-5xl flex items-center px-4 ml-2 mb-3 mt-3 rounded-xl 
                                            transition-all duration-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]">

                                    {/* Logo */}
                                    <img
                                        src={logoUrl}
                                        alt={`${company} logo`}
                                        className="w-12 h-12 absolute left-[30px]"
                                        onError={(e) => (e.target.src = 'https://www.svgrepo.com/download/9509/bank.svg')}
                                    />

                                    {/* Company Name */}
                                    <span className="absolute left-[90px]"
                                        style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>{company}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Third Column: Expanding Data Area */}
                <Overview hoveredCompany={hoveredCompany} newData={newData} />
            </div>
        </div>
    );
}

function transformData(data) {

    // Function to compute percentile rank
    const getPercentileRank = (arr, value) => {
        return (arr.filter(x => x < value).length / (arr.length-1) ) * 100;
    };

    // Extract each column and sort
    const e_scores = data.map(c => c.e_score).sort((a, b) => a - b);
    const s_scores = data.map(c => c.s_score).sort((a, b) => a - b);
    const g_scores = data.map(c => c.g_score).sort((a, b) => a - b);

    // Map the companies array to replace scores with percentiles
    const companiesWithPercentiles = data.map(company => ({
        company_name: company.company_name,
        e_percentile: getPercentileRank(e_scores, company.e_score),
        s_percentile: getPercentileRank(s_scores, company.s_score),
        g_percentile: getPercentileRank(g_scores, company.g_score)
    }));


    return companiesWithPercentiles;
}

const threshold = 40;

const AwardWithLeaf = ({ percentile, size = 16 }) => {
    if (percentile < threshold) {
        return (
            <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            </div>
        );
    }
    return (
        <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            {/* Award SVG - Background */}
            <svg xmlns="http://www.w3.org/2000/svg"
                width="900" height="900" fill="none"
                viewBox="0 0 24 24">
                <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"
                    d="M7.869 15.46 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.868-6.543m.294-11.208c.154.373.45.67.824.825l1.309.542a1.525 1.525 0 0 1 .825 1.992l-.542 1.308a1.522 1.522 0 0 0 0 1.168l.542 1.307a1.525 1.525 0 0 1-.826 1.993l-1.308.542c-.373.154-.67.45-.825.824l-.542 1.309a1.524 1.524 0 0 1-1.992.825l-1.308-.542a1.525 1.525 0 0 0-1.166 0l-1.31.542a1.524 1.524 0 0 1-1.99-.824l-.542-1.31a1.524 1.524 0 0 0-.824-.825l-1.31-.542a1.524 1.524 0 0 1-.825-1.991l.542-1.308a1.525 1.525 0 0 0 0-1.167l-.542-1.31a1.525 1.525 0 0 1 .826-1.992l1.307-.542c.374-.154.67-.45.825-.823l.543-1.309a1.524 1.524 0 0 1 1.991-.825l1.308.542c.374.154.793.154 1.167-.001l1.31-.54a1.525 1.525 0 0 1 1.99.825l.543 1.31v-.003Z" />
            </svg>

            {/* Leaf SVG - Foreground (Shifted Up) */}
            <svg xmlns="http://www.w3.org/2000/svg"
                width="800" height="800" viewBox="0 0 32 32"
            className="absolute w-6 h-6 top-[9px]"            >
                <path d="M29.555 2.843a.751.751 0 0 0-.565-.546l-.005-.001a.756.756 0 0 0-.743.265l-.001.001a14.022 14.022 0 0 1-6.462 4.32l-.099.027c-1.693.552-3.662.946-5.697 1.103l-.088.005c-2.231.083-4.325.58-6.236 1.417l.11-.043c-3.3 1.788-5.502 5.225-5.502 9.176l.002.186v-.009c.009.303.03.602.064.9.154 1.198.484 2.285.966 3.285l-.028-.064a29.629 29.629 0 0 0-3.886 6.67l-.073.197a.75.75 0 0 0 1.378.595l.002-.005c.964-2.307 2.092-4.294 3.425-6.123l-.059.085a11.11 11.11 0 0 0 4.567 4.021l.067.029a11.695 11.695 0 0 0 4.833 1.028h.079-.004a13.865 13.865 0 0 0 5.324-1.081l-.092.034c5.262-2.385 9.002-7.306 9.678-13.16l.007-.077a29.82 29.82 0 0 0 .231-3.762c0-3.018-.436-5.935-1.247-8.69l.055.217zm-.524 12.012a15.05 15.05 0 0 1-8.674 12.03l-.094.038a11.212 11.212 0 0 1-4.528.939c-1.599 0-3.121-.329-4.501-.924l.074.028a9.636 9.636 0 0 1-4.242-3.864l-.024-.045c3.317-3.812 7.63-5.711 13.801-6.312a.75.75 0 0 0-.148-1.493h.003a21.076 21.076 0 0 0-14.343 6.343l-.004.004a8.752 8.752 0 0 1-.526-2.083l-.005-.045a8.618 8.618 0 0 1-.057-.934 8.852 8.852 0 0 1 4.623-7.78l.046-.023c1.65-.708 3.565-1.152 5.575-1.225l.028-.001a27.183 27.183 0 0 0 6.313-1.232l-.192.054a16.294 16.294 0 0 0 6.279-3.744l-.006.005c.523 2.02.823 4.338.823 6.727 0 1.247-.082 2.475-.24 3.678l.015-.142z" />
            </svg>
        </div>
    );
};

const AwardWithPerson = ({ percentile, size = 16 }) => {
    if (percentile < threshold) {
        return (
            <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            </div>
        );
    }
    return (
        <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            {/* Award SVG - Background */}
            <svg xmlns="http://www.w3.org/2000/svg"
                width="900" height="900" fill="none"
                viewBox="0 0 24 24">
                <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"
                    d="M7.869 15.46 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.868-6.543m.294-11.208c.154.373.45.67.824.825l1.309.542a1.525 1.525 0 0 1 .825 1.992l-.542 1.308a1.522 1.522 0 0 0 0 1.168l.542 1.307a1.525 1.525 0 0 1-.826 1.993l-1.308.542c-.373.154-.67.45-.825.824l-.542 1.309a1.524 1.524 0 0 1-1.992.825l-1.308-.542a1.525 1.525 0 0 0-1.166 0l-1.31.542a1.524 1.524 0 0 1-1.99-.824l-.542-1.31a1.524 1.524 0 0 0-.824-.825l-1.31-.542a1.524 1.524 0 0 1-.825-1.991l.542-1.308a1.525 1.525 0 0 0 0-1.167l-.542-1.31a1.525 1.525 0 0 1 .826-1.992l1.307-.542c.374-.154.67-.45.825-.823l.543-1.309a1.524 1.524 0 0 1 1.991-.825l1.308.542c.374.154.793.154 1.167-.001l1.31-.54a1.525 1.525 0 0 1 1.99.825l.543 1.31v-.003Z" />
            </svg>

            {/* Person SVG - Foreground (Shifted Up) */}
            <svg xmlns="http://www.w3.org/2000/svg"
                width="800" height="800" fill="none" stroke="#000" stroke-width="3" viewBox="0 0 64 64"
            className="absolute w-6 h-6 top-[9px]"            >
                <circle cx="32" cy="18.14" r="11.14" />
                <path d="M54.55 56.85A22.55 22.55 0 0 0 32 34.3 22.55 22.55 0 0 0 9.45 56.85Z" /></svg>
        </div>
    );
};

const AwardWithGavel = ({ percentile, size = 16 }) => {
    if (percentile < threshold) {
        return (
            <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            </div>
        );
    }
    return (
        <div className={`relative flex items-center justify-center w-${size} h-${size}`}>
            {/* Award SVG - Background */}
            <svg xmlns="http://www.w3.org/2000/svg"
                width="900" height="900" fill="none"
                viewBox="0 0 24 24">
                <path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5"
                    d="M7.869 15.46 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.868-6.543m.294-11.208c.154.373.45.67.824.825l1.309.542a1.525 1.525 0 0 1 .825 1.992l-.542 1.308a1.522 1.522 0 0 0 0 1.168l.542 1.307a1.525 1.525 0 0 1-.826 1.993l-1.308.542c-.373.154-.67.45-.825.824l-.542 1.309a1.524 1.524 0 0 1-1.992.825l-1.308-.542a1.525 1.525 0 0 0-1.166 0l-1.31.542a1.524 1.524 0 0 1-1.99-.824l-.542-1.31a1.524 1.524 0 0 0-.824-.825l-1.31-.542a1.524 1.524 0 0 1-.825-1.991l.542-1.308a1.525 1.525 0 0 0 0-1.167l-.542-1.31a1.525 1.525 0 0 1 .826-1.992l1.307-.542c.374-.154.67-.45.825-.823l.543-1.309a1.524 1.524 0 0 1 1.991-.825l1.308.542c.374.154.793.154 1.167-.001l1.31-.54a1.525 1.525 0 0 1 1.99.825l.543 1.31v-.003Z" />
            </svg>

            {/* Leaf SVG - Foreground (Shifted Up) */}
            <svg xmlns="http://www.w3.org/2000/svg"
                width="800" height="800" viewBox="0 0 36 36"
                className="absolute w-6 h-6 top-[9px]">
                <path d="M23.7 10.41a1 1 0 0 1-.71-.29l-7.43-7.43A1 1 0 0 1 17 1.28l7.44 7.43a1 1 0 0 1-.71 1.7ZM11.86 22.25a1 1 0 0 0-.29-.71l-7.43-7.43a1 1 0 0 0-1.42 1.42L10.15 23a1 1 0 0 0 1.42 0 1 1 0 0 0 .29-.75ZM21.93 34H3a1 1 0 0 1-1-1.27l1.13-4a1 1 0 0 1 1-.73H20.8a1 1 0 0 1 1 .73l1.13 4a1 1 0 0 1-.17.87 1 1 0 0 1-.83.4ZM4.31 32H20.6l-.6-2H4.87ZM33.11 27.44l-14-14 2.36-2.36-6.95-6.95-8.94 8.94L12.51 20l2.35-2.34 14 14a3 3 0 0 0 4.24 0 3 3 0 0 0 .01-4.22ZM8.4 13.07 14.52 7l4.11 4.11-6.12 6.11Zm23.29 17.2a1 1 0 0 1-1.41 0l-14-14 1.41-1.41 14 14a1 1 0 0 1 0 1.41Z" />
                <path fill="none" d="M0 0h36v36H0z" />
            </svg>
        </div>
    );
};


const Overview = ({ hoveredCompany, newData }) => {

    const [imageError, setImageError] = useState(false);

    const handleError = () => {
        setImageError(true);
    };

    if (hoveredCompany === null) {
        return (
            <div className="absolute left-[450px] h-120 top-0 bottom-0 w-80 bg-white">
            </div>
        );
    }
    const companyData = newData ? newData.find(companyData => companyData.company_name === hoveredCompany) : null;
    return (
        <div className="absolute left-[450px] h-125 top-0 bottom-0 w-80 border-3 
                                    border-[rgba(64,121,47,0.8)] bg-white rounded-3xl mt-3">
            {/* Placeholder for graphs/data */}
            <div className="h-full flex flex-col items-center justify-start px-4 ">
                <img
                    src={getFullLogo(hoveredCompany)}
                    alt={`${hoveredCompany} logo`}
                    className="h-40 object-contain"
                    onError={(e) => (e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Banco_Santander_Logotipo.svg')}
                />
                
                <div className="w-full flex h-40 items-center justify-center">
                    <CircularArcEco startAngle={15} endAngle={345} radius={42} strokeColor={"green"} percent={companyData.e_percentile} />  
                    <CircularArcSoc startAngle={15} endAngle={345} radius={42} strokeColor={"#e7812c"} percent={companyData.s_percentile} />  
                </div>

                <div className="w-full flex h-40 items-center justify-center">
                    <CircularArcGov startAngle={15} endAngle={345} radius={42} strokeColor={"purple"} percent={companyData.g_percentile} />
                </div>
                    
                

            </div>
        </div>
    );
}
function getFullLogo(company) {
    const logoMapping = {
        "OCBC": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Logo-ocbc.svg",
        "ANZ": "https://upload.wikimedia.org/wikipedia/en/e/e7/ANZ-brand.svg",
        "Banco Santander": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Banco_Santander_Logotipo.svg",
        "Woori Bank": "https://upload.wikimedia.org/wikipedia/en/d/d7/Woori_Bank_Logo.png",
        "BOQ": "https://d1xafqim8ep2fx.cloudfront.net/assets/boq/boq118b/logo.svg",
        // Add more companies and their respective logos here
    };

    return logoMapping[company];
}
function getPartialLogo(company) {
    const logoMapping = {
        "OCBC": "https://cdn.brandfetch.io/idY-deZG93/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
        "ANZ": "https://cdn.brandfetch.io/idC_v9j0Lj/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
        "Banco Santander": "https://e7.pngegg.com/pngimages/512/702/png-clipart-santander-bank-santander-group-santander-securities-llc-bank-text-logo-thumbnail.png",
        "Woori Bank": "https://companieslogo.com/img/orig/WF-3bf9f53a.svg?t=1720244494&download=truehttps://companieslogo.com/img/orig/WF-3bf9f53a.svg?t=1720244494&download=true",
        "BOQ": "https://upload.wikimedia.org/wikipedia/en/a/a6/Bank_of_Queensland_Limited.png",
        // Add more companies and their respective logos here
    };

    return logoMapping[company];
}

const CircularArcEco = ({ startAngle, endAngle, radius, strokeColor, percent }) => {
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
        .startAngle(-(startAngle * Math.PI) / 180 ) // Convert degrees to radians
        .endAngle(-(endAngle * Math.PI * percentile) / 18000);

    return (
        <svg width="100" height="100" viewBox="-50 -50 100 100">
            <path d={circleConst()} fill="none" stroke={strokeColor} strokeWidth="1" />
            {percentile>5 && (<path d={createArc()} fill="none" stroke={strokeColor} strokeWidth="4" />)}
            <g transform={`translate(-8, ${-1.25*radius}) scale(${0.5})`}>
                <path d="M29.555 2.843a.751.751 0 0 0-.565-.546l-.005-.001a.756.756 0 0 0-.743.265l-.001.001a14.022 14.022 0 0 1-6.462 4.32l-.099.027c-1.693.552-3.662.946-5.697 1.103l-.088.005c-2.231.083-4.325.58-6.236 1.417l.11-.043c-3.3 1.788-5.502 5.225-5.502 9.176l.002.186v-.009c.009.303.03.602.064.9.154 1.198.484 2.285.966 3.285l-.028-.064a29.629 29.629 0 0 0-3.886 6.67l-.073.197a.75.75 0 0 0 1.378.595l.002-.005c.964-2.307 2.092-4.294 3.425-6.123l-.059.085a11.11 11.11 0 0 0 4.567 4.021l.067.029a11.695 11.695 0 0 0 4.833 1.028h.079-.004a13.865 13.865 0 0 0 5.324-1.081l-.092.034c5.262-2.385 9.002-7.306 9.678-13.16l.007-.077a29.82 29.82 0 0 0 .231-3.762c0-3.018-.436-5.935-1.247-8.69l.055.217zm-.524 12.012a15.05 15.05 0 0 1-8.674 12.03l-.094.038a11.212 11.212 0 0 1-4.528.939c-1.599 0-3.121-.329-4.501-.924l.074.028a9.636 9.636 0 0 1-4.242-3.864l-.024-.045c3.317-3.812 7.63-5.711 13.801-6.312a.75.75 0 0 0-.148-1.493h.003a21.076 21.076 0 0 0-14.343 6.343l-.004.004a8.752 8.752 0 0 1-.526-2.083l-.005-.045a8.618 8.618 0 0 1-.057-.934 8.852 8.852 0 0 1 4.623-7.78l.046-.023c1.65-.708 3.565-1.152 5.575-1.225l.028-.001a27.183 27.183 0 0 0 6.313-1.232l-.192.054a16.294 16.294 0 0 0 6.279-3.744l-.006.005c.523 2.02.823 4.338.823 6.727 0 1.247-.082 2.475-.24 3.678l.015-.142z"
                    fill="green" stroke="green" strokeWidth="1" />
            </g>
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle">
                <tspan x="0" dy="-20" fontSize="10" fill="gray">Top</tspan>
                <tspan x="0" dy="25" fontSize="36" fill="green">{100 - Math.round(percentile)}</tspan>
                <tspan dy="4" fontSize="20" fill="green">%</tspan>
            </text>
        </svg>
    );
};

const CircularArcSoc = ({ startAngle, endAngle, radius, strokeColor, percent }) => {
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
            <path d={circleConst()} fill="none" stroke={strokeColor} strokeWidth="1" />
            {percentile > 5 && (<path d={createArc()} fill="none" stroke={strokeColor} strokeWidth="4" />)}
            <g transform={`translate(-10, ${-1.25 * radius}) scale(${0.3})`}>
                <circle cx="32" cy="18.14" r="11.14" fill="#e7812c" stroke="#e7812c" />
                <path d="M54.55 56.85A22.55 22.55 0 0 0 32 34.3 22.55 22.55 0 0 0 9.45 56.85Z"
                    fill="#e7812c" stroke="#e7812c" strokeWidth="1" />
            </g>
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle">
                <tspan x="0" dy="-20" fontSize="10" fill="gray">Top</tspan>
                <tspan x="0" dy="25" fontSize="36" fill="#e7812c">{100 - Math.round(percentile)}</tspan>
                <tspan dy="4" fontSize="20" fill="#e7812c">%</tspan>
            </text>
        </svg>
    );
};

const CircularArcGov = ({ startAngle, endAngle, radius, strokeColor, percent }) => {

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
            <path d={circleConst()} fill="none" stroke={strokeColor} strokeWidth="1" />
            {percentile > 5 && (<path d={createArc()} fill="none" stroke={strokeColor} strokeWidth="4" />)}
            <g transform={`translate(-10, ${-1.25 * radius}) scale(${0.6})`}>
                <path d="M23.7 10.41a1 1 0 0 1-.71-.29l-7.43-7.43A1 1 0 0 1 17 1.28l7.44 7.43a1 1 0 0 1-.71 1.7ZM11.86 22.25a1 1 0 0 0-.29-.71l-7.43-7.43a1 1 0 0 0-1.42 1.42L10.15 23a1 1 0 0 0 1.42 0 1 1 0 0 0 .29-.75ZM21.93 34H3a1 1 0 0 1-1-1.27l1.13-4a1 1 0 0 1 1-.73H20.8a1 1 0 0 1 1 .73l1.13 4a1 1 0 0 1-.17.87 1 1 0 0 1-.83.4ZM4.31 32H20.6l-.6-2H4.87ZM33.11 27.44l-14-14 2.36-2.36-6.95-6.95-8.94 8.94L12.51 20l2.35-2.34 14 14a3 3 0 0 0 4.24 0 3 3 0 0 0 .01-4.22ZM8.4 13.07 14.52 7l4.11 4.11-6.12 6.11Zm23.29 17.2a1 1 0 0 1-1.41 0l-14-14 1.41-1.41 14 14a1 1 0 0 1 0 1.41Z"
                    fill="purple" stroke="purple"/>
                <path fill="none" d="M0 0h36v36H0z" />
            </g>
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle">
                <tspan x="0" dy="-20" fontSize="10" fill="gray">Top</tspan>
                <tspan x="0" dy="25" fontSize="36" fill="purple">{100 - Math.round(percentile)}</tspan>
                <tspan dy="4" fontSize="20" fill="purple">%</tspan>
            </text>
        </svg>
    );
};