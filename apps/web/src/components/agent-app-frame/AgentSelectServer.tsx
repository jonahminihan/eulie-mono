import { usePref } from "@/contexts/PrefContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Input } from "../ui/input";
import { TypographyH4 } from "../ui/typography/TypographyH4";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";

const AgentSelectServer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { addServer } = usePref();

  const handleAddThisComputer = () => {
    addServer({ ip: "localhost", port: 3030 });
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const serverURL = formData.get("serverURL") as string;
    addServer({ ip: serverURL, port: 3030 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <TypographyH4 text="Add Server" />
          <TypographyMuted text="Work on this computer" />
          <Button onClick={handleAddThisComputer}>Add this computer</Button>
          <TypographyP text="or" className="text-center" />
          <TypographyMuted text="Add a remote server to work off of" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Server ip address (e.g. 192.168.1.100)"
              name="serverURL"
            />
            <Button type="submit">Add</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentSelectServer;
