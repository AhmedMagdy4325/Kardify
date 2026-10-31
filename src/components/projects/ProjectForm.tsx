import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppButton from "../ui/AppButton";

type ProjectFormProps = {
  // Empty when creating, filled in when editing
  initialName?: string;
  initialDescription?: string;
  submitLabel: string;
  onSubmit: (values: { name: string; description: string }) => void;
  onCancel: () => void;
};

/**
 * The name and description form, shared by the create and edit dialogs.
 * It knows nothing about Redux or dialogs: it validates, then hands the
 * cleaned values to `onSubmit`, and the parent decides what saving means.
 */
export default function ProjectForm({
  initialName = "",
  initialDescription = "",
  submitLabel,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const { t } = useTranslation(["projects", "common"]);

  // The initial values are only read on the first render. That is enough
  // because the parent renders this form inside DialogContent, which unmounts
  // when the dialog closes, so every opening starts from fresh values.
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser's own form submit (page reload)
    const trimmedName = name.trim();
    // Only the name is required, and it can't be just spaces.
    if (!trimmedName) return setError(t("nameRequired"));
    onSubmit({ name: trimmedName, description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-name">{t("name")}</Label>
        <Input
          id="project-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(""); // clear the error as soon as the user fixes it
          }}
          placeholder={t("namePlaceholder")}
          maxLength={60} // keeps names short enough for cards and the sidebar
          autoFocus
          // User-written text picks its own direction (English text in an
          // Arabic page, and the other way around)
          dir="auto"
          // Lets screen readers know the field is invalid and which message
          // describes the problem
          aria-invalid={!!error}
          aria-describedby={error ? "project-error" : undefined}
        />
        {/* role="alert" makes the message announce itself when it appears */}
        {error && (
          <p id="project-error" role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="project-description">{t("description")}</Label>
        <Textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("descriptionPlaceholder")}
          maxLength={200}
          rows={3}
          dir="auto"
        />
      </div>
      <DialogFooter>
        {/* type="button" so Cancel never submits the form */}
        <AppButton variant="ghost" type="button" onClick={onCancel}>
          {t("common:cancel")}
        </AppButton>
        <AppButton variant="primary" type="submit">
          {submitLabel}
        </AppButton>
      </DialogFooter>
    </form>
  );
}
