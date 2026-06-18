import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AppShell";
import { useCurrentUser, useData } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/qr")({ component: QRPage });

function QRPage() {
  const user = useCurrentUser();
  const { qr, setQR } = useData();
  const isMaintainer = user?.role === "maintainer";

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { setQR({ ...qr, qrImage: r.result as string }); toast.success("QR updated"); };
    r.readAsDataURL(f);
  };

  return (
    <>
      <PageHeader title="QR Payments" description={isMaintainer ? "Manage hostel payment QR" : "Scan to pay"} />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>QR Code</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            {qr.qrImage ? (
              <img src={qr.qrImage} alt="QR" className="size-64 object-contain border rounded" />
            ) : (
              <div className="size-64 border rounded grid place-items-center text-muted-foreground text-sm">No QR uploaded</div>
            )}
            {qr.qrImage && (
              <Button variant="outline" asChild>
                <a href={qr.qrImage} download="hostel-qr.png">Download QR</a>
              </Button>
            )}
            {isMaintainer && (
              <>
                <Input type="file" accept="image/*" onChange={upload} />
                {qr.qrImage && <Button variant="destructive" onClick={() => { setQR({ ...qr, qrImage: undefined }); toast.success("QR deleted"); }}>Delete QR</Button>}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>UPI ID</Label><Input value={qr.upiId} disabled={!isMaintainer} onChange={(e) => setQR({ ...qr, upiId: e.target.value })} /></div>
            <div className="space-y-1"><Label>Payee Name</Label><Input value={qr.payeeName} disabled={!isMaintainer} onChange={(e) => setQR({ ...qr, payeeName: e.target.value })} /></div>
            {isMaintainer && <Button onClick={() => toast.success("Saved")}>Save</Button>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
