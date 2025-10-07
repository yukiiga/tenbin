export default function PlayerIcon({ selected, onSelect, options }) {
  return (
    <div className="flex space-x-2">
      {options.map((icon, i) => (
        <img
          key={i}
          src={icon}
          alt={`icon${i}`}
          className={`w-10 h-10 rounded-full cursor-pointer border ${
            selected === icon ? "border-blue-400" : "border-gray-500"
          }`}
          onClick={() => onSelect(icon)}
        />
      ))}
    </div>
  );
}
