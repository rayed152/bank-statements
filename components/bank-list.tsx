import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBankNames } from "@/actions/bank";
import Link from "next/link";

export default async function BankList() {
  const res = await getBankNames();

  if (!res.success || !res.banks) {
    return <p className="text-red-500">Failed to load banks.</p>;
  }

  const banks = res.banks;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {banks.map((bank) => (
        <Link key={bank.id} href={`/${bank.id}`} passHref>
          <Card
            key={bank.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {bank.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Image
                src="/banklist.svg"
                alt="Bank image"
                width={600}
                height={400}
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
