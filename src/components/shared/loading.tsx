interface LoadingProps {
  label: string;
}

const Loading: React.FC<LoadingProps> = ({ label }) => {
  return (
    <div className="flex items-center gap-3 text-slate-500 font-mono animate-pulse w-full">
      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      <p>{label}</p>
    </div>
  );
};

export default Loading;
