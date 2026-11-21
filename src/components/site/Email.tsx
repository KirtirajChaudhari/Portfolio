/** An address that may break after the @ and nowhere else. */
export default function Email({ address }: { address: string }) {
  const at = address.indexOf('@');
  return <>{address.slice(0, at + 1)}<wbr />{address.slice(at + 1)}</>;
}
