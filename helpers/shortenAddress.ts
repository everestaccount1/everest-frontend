export default function shortenAddress (addr: string) {
  if (!addr) return '';
  return addr.slice(0,4)  + '...' + addr.slice(addr.length - 4, addr.length);
}