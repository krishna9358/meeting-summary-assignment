interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        AI Meeting Summarizer
      </h1>
      <p className="text-gray-600">
        Transform meeting transcripts into actionable insights
      </p>
    </div>
  );
};
