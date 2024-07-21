
const PieChart = ({perct, rad=45}:{perct:number; rad:number|undefined})=>{
    return (
        <div className="relative flex items-center justify-center">
            <svg className="transform">
                <circle cx="50%" cy="50%" r={rad} fill="none" stroke="#F5F5F5" strokeWidth="8"></circle>
                <circle cx="50%" cy="50%" r={rad} fill="none" stroke="#303778" strokeWidth="8" 
                        strokeDasharray={`calc(2 * 3.14 * 50 * 0.01 * ${perct}) calc(2 * 3.14 * 50)`}></circle>
            </svg>
            <h1 className="text-2xl absolute font-semibold text-gray-700">
                {`${perct}%`}
            </h1>
        </div>
    )
}

export default PieChart;