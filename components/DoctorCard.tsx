type Props = {
  name: string;
  image?: string;
  specialist: string;
};
export default function DoctorCard({ doctor, onSelect }: { doctor: any; onSelect: () => void }) {
  return (
    <div onClick={onSelect} className="border p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
      <p className="font-semibold">{doctor.specialist}</p>
      <p className="text-sm text-gray-600">{doctor.reason}</p>
    </div>
  );
}
