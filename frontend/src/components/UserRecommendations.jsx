export default function UserRecommendations({ companies }) {
    return (
        <ul className="flex flex-col items-center space-y-4 pb-20">
            {companies.map((company, index) => {
                const logoUrl = `https://raw.githubusercontent.com/icongo/bank-logos/main/logos/${company.toLowerCase().replace(/\s+/g, '-')}-rect.svg`;

                return (
                    <li
                        key={index}
                        className="w-[280px] h-[50px] text-[35px] px-4 py-2 bg-emerald-700 
                                text-white font-semibold flex items-center justify-start space-x-3 
                                rounded-lg shadow-md relative"
                    >
                        {/* Logo */}
                        <img
                            src={logoUrl}
                            alt={`${company} logo`}
                            className="w-12 h-12 absolute left-[50px]"
                            onError={(e) => (e.target.src = 'https://www.svgrepo.com/download/9509/bank.svg')}
                        />

                        {/* Text */}
                        <span
                            className="absolute left-[60px] text-left"
                            style={{ left: '130px' }}  // X (for logo) + Y (spacing for text)
                        >
                            {company}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}
