
const PieChart = ({perct, rad=45}:{perct:number; rad:number})=>{
    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform">
                <circle cx="50%" cy="50%" r={rad} fill="none" stroke="#E2E8F0" stroke-width="8"></circle>
                <circle cx="50%" cy="50%" r={rad} fill="none" stroke="var(--background)" stroke-width="8" 
                        stroke-dasharray={`calc(2 * 3.14 * 45 * 0.01 * ${perct}) calc(2 * 3.14 * 45)`}></circle>
            </svg>
            <h1 className="text-2xl absolute font-semibold text-gray-700">
                {`${perct}%`}
            </h1>
        </div>
    )
}

export default PieChart;