import { useState } from 'react';


export default function UserRecommendations({ companies }) {

    const [hoveredCompany, setHoveredCompany] = useState(null);
    return (
        <div className="flex items-center justify-center w-screen">
            <div className="relative w-[700px] flex flex-col items-center space-y-4 pb-20 group">
                <ul className="relative w-full">
                    {companies.map((company, index) => {
                        const logoUrl = `https://raw.githubusercontent.com/icongo/bank-logos/main/logos/${company.toLowerCase().replace(/\s+/g, '-')}-rect.svg`;

                        return (
                            <li
                                key={index}
                                className="relative flex items-center space-x-3 w-full transition-all duration-300 group-hover:z-10"
                                onMouseEnter={() => setHoveredCompany(company)} // Set hovered company on hover
                                onMouseLeave={() => setHoveredCompany(null)} // Reset on hover leave
                            >
                                {/* First Column: Numbered Circle - Environment*/}
                                <div className="relative flex flex-col items-center">
                                    {/* Leaf SVG - Foreground Layer */}
                                    <img
                                        src="https://www.svgrepo.com/download/473275/leaf.svg"
                                        alt="Leaf Icon"
                                        className="w-12 h-12"
                                    />
                                </div>

                                {/* First Column: Numbered Circle -Social */}
                                <div className="relative flex flex-col items-center">
                                    {/* Overlapping SVG (Separate from the clipped div) */}
                                    <img
                                        src="https://www.svgrepo.com/download/447734/person-male.svg"  // Replace with actual SVG
                                        alt="Icon"
                                        className="w-12 h-12"
                                    />

                                </div>

                                {/* First Column: Numbered Circle - Governance */}
                                <div className="relative flex flex-col items-center">
                                    {/* Overlapping SVG (Separate from the clipped div) */}
                                    <img
                                        src="https://www.svgrepo.com/download/372451/gavel.svg"  // Replace with actual SVG
                                        alt="Icon"
                                        className="w-12 h-12"
                                    />
                                </div>

                                {/* Second Column: Main Row (Expanding) */}
                                <div className="relative w-[280px] h-[50px] bg-emerald-700 text-white 
                                                font-semibold text-5xl flex items-center px-4 ml-2 mb-3 mt-3 rounded-lg 
                                                transition-all duration-50 hover:w-[300px]">

                                    {/* Logo */}
                                    <img
                                        src={logoUrl}
                                        alt={`${company} logo`}
                                        className="w-12 h-12 absolute left-[50px]"
                                        onError={(e) => (e.target.src = 'https://www.svgrepo.com/download/9509/bank.svg')}
                                    />

                                    {/* Company Name */}
                                    <span className="absolute left-[130px]">{company}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Third Column: Expanding Data Area */}
                <div className="absolute left-[430px] top-0 bottom-0 w-80 border-2 
                                    border-emerald-800 bg-white rounded-lg z-10">
                    {/* Placeholder for graphs/data */}
                    <div className="h-full flex flex-col items-center justify-center">
                        <span className="text-black text-xl font-semibold">{hoveredCompany ? hoveredCompany : "Select a company to view data"} {/* Display the hovered company name or default text */}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
