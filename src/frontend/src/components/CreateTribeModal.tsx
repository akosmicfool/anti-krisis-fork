import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateTribe } from "../hooks/use-backend";

interface Props {
  onClose: () => void;
}

async function compressTribePhoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 400;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > MAX) {
          h = Math.round((h * MAX) / w);
          w = MAX;
        }
      } else {
        if (h > MAX) {
          w = Math.round((w * MAX) / h);
          h = MAX;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = url;
  });
}
async function compressCoverImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX_W = 1200;
      let w = img.width;
      let h = img.height;
      if (w > MAX_W) {
        h = Math.round((h * MAX_W) / w);
        w = MAX_W;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.src = url;
  });
}

export function CreateTribeModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const createTribe = useCreateTribe();

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", { description: "Max 5MB allowed." });
      return;
    }
    const compressed = await compressTribePhoto(file);
    setPhotoUrl(compressed);
  }

  async function handleCoverImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", { description: "Max 5MB allowed." });
      return;
    }
    const compressed = await compressCoverImage(file);
    setCoverImageUrl(compressed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tribe name is required");
      return;
    }
    try {
      await createTribe.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        photoUrl,
        coverImageUrl,
      });
      toast.success("Tribe created!", {
        description: `${name.trim()} is now live.`,
      });
      onClose();
    } catch (err) {
      toast.error("Failed to create tribe", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      data-ocid="create-tribe.dialog"
    >
      <div
        className="relative w-full max-w-md mx-4 bg-card pixel-border p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 0 32px rgba(0,255,65,0.15)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-accent tracking-widest uppercase">
            Create Tribe
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-accent transition-colors"
            aria-label="Close"
            data-ocid="create-tribe.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="font-accent text-[10px] uppercase tracking-widest text-accent">
              Cover Image
            </Label>
            <button
              type="button"
              className="relative w-full h-24 pixel-border overflow-hidden bg-muted cursor-pointer hover:bg-muted/80 transition-colors flex items-center justify-center"
              onClick={() => coverFileRef.current?.click()}
              aria-label="Upload cover image"
            >
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Camera className="h-6 w-6" />
                  <span className="font-accent text-[9px] uppercase tracking-widest">
                    Upload Cover
                  </span>
                </div>
              )}
            </button>
            <input
              ref={coverFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImage}
              data-ocid="create-tribe.cover_upload_button"
            />
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <Label className="font-accent text-[10px] uppercase tracking-widest text-accent">
              Tribe Photo
            </Label>
            <button
              type="button"
              className="relative w-24 h-24 pixel-border overflow-hidden bg-muted cursor-pointer hover:bg-muted/80 transition-colors flex items-center justify-center"
              onClick={() => fileRef.current?.click()}
              aria-label="Upload tribe photo"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Tribe"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
              data-ocid="create-tribe.photo_upload_button"
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label
              htmlFor="tribe-name"
              className="font-accent text-[10px] uppercase tracking-widest text-accent"
            >
              Tribe Name *
            </Label>
            <Input
              id="tribe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pixel Warriors"
              maxLength={30}
              className="bg-input border-border text-foreground font-mono text-sm focus:ring-accent focus:border-accent"
              data-ocid="create-tribe.name_input"
            />
            <p className="font-accent text-[9px] text-muted-foreground">
              {name.length}/30
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label
              htmlFor="tribe-desc"
              className="font-accent text-[10px] uppercase tracking-widest text-accent"
            >
              Description
            </Label>
            <Textarea
              id="tribe-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is your tribe about?"
              rows={3}
              maxLength={500}
              className="bg-input border-border text-foreground font-mono text-sm resize-none focus:ring-accent focus:border-accent"
              data-ocid="create-tribe.description_textarea"
            />
            <p className="font-accent text-[9px] text-muted-foreground">
              {description.length}/500
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-accent text-[10px] uppercase tracking-widest border-border text-muted-foreground hover:text-foreground"
              data-ocid="create-tribe.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTribe.isPending || !name.trim()}
              className="flex-1 font-accent text-[10px] uppercase tracking-widest bg-primary hover:bg-primary/80 text-primary-foreground btn-glow"
              data-ocid="create-tribe.submit_button"
            >
              {createTribe.isPending ? "Creating…" : "Create Tribe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
