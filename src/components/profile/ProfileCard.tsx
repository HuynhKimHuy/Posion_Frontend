import type { User } from "@/types/user"
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, PencilLine, Save, X } from "lucide-react";
import {
    PROFILE_BIO_MAX_LENGTH,
    PROFILE_COVER_HINT_TEXT,
    PROFILE_EMPTY_BIO_TEXT,
} from "./profile.constants";
import { buildProfileDisplayName, getProfileInitials } from "./profile.utils";

interface ProfileCardProps {
    user: User | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
    const updateProfile = useAuthStore((state) => state.updateProfile)
    const updateCoverImage = useAuthStore((state) => state.updateCoverImage)
    const loading = useAuthStore((state) => state.loading)
    const [bio, setBio] = useState("")
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const cameraInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setBio(user?.bio || "")
    }, [user?.bio])

    useEffect(() => {
        return () => {
            if (coverPreview) {
                URL.revokeObjectURL(coverPreview)
            }
        }
    }, [coverPreview])

    if (!user) return null

    const currentBio = user.bio || PROFILE_EMPTY_BIO_TEXT
    const displayName = buildProfileDisplayName(user)
    const coverImage = coverPreview || user.coverUrl || ""

    const openCameraPicker = () => {
        cameraInputRef.current?.click()
    }

    const handlePickCoverFromAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (coverPreview) {
            URL.revokeObjectURL(coverPreview)
        }
        const localUrl = URL.createObjectURL(file)
        setCoverPreview(localUrl)
        await updateCoverImage(file)
        event.target.value = ""
    }

    const handleSaveBio = async () => {
        await updateProfile(bio)
        setIsEditingBio(false)
    }

    const handleCancelBioEdit = () => {
        setBio(user.bio || "")
        setIsEditingBio(false)
    }

    return(
        <div className="w-full overflow-hidden rounded-2xl border border-white/20 bg-card/70 shadow-xl backdrop-blur-sm">
            <div className="relative h-48 w-full overflow-hidden border-b border-white/20 bg-linear-to-r from-sky-500/25 via-cyan-400/15 to-emerald-400/20">
                {coverImage ? (
                    <img src={coverImage} alt="Cover" className="h-full w-full object-cover opacity-85" />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_45%),linear-gradient(120deg,rgba(56,189,248,0.35),rgba(16,185,129,0.22),rgba(14,165,233,0.28))]" />
                )}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="relative px-6 pb-6">
                <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-end gap-4">
                        <div className="relative">
                            <Avatar className="size-28 border-4 border-background shadow-md">
                                <AvatarImage src={user.avatarUrl} alt={displayName} />
                                    <AvatarFallback className="text-lg font-semibold">{getProfileInitials(displayName)}</AvatarFallback>
                            </Avatar>
                            <Button
                                type="button"
                                size="icon-sm"
                                className="absolute right-0 bottom-0 rounded-full"
                                onClick={openCameraPicker}
                                disabled={loading}
                            >
                                <Camera className="size-4" />
                            </Button>
                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => void handlePickCoverFromAvatar(event)}
                            />
                        </div>
                        <div className="pb-2">
                            <h2 className="text-xl font-bold leading-tight">{displayName}</h2>
                            <p className="text-sm text-muted-foreground">@{user.userName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 px-6 pb-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Giới thiệu</h3>
                    {!isEditingBio ? (
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsEditingBio(true)}>
                            <PencilLine className="size-4" />
                            Chỉnh sửa bio
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={handleCancelBioEdit}>
                                <X className="size-4" />
                                Hủy
                            </Button>
                            <Button type="button" size="sm" onClick={() => void handleSaveBio()} disabled={loading}>
                                <Save className="size-4" />
                                {loading ? "Đang lưu..." : "Lưu"}
                            </Button>
                        </div>
                    )}
                </div>

                {!isEditingBio ? (
                    <p className="rounded-lg border bg-background/80 p-4 text-sm text-muted-foreground">{currentBio}</p>
                ) : (
                    <div className="space-y-2">
                        <Textarea
                            id="profile-bio"
                            rows={4}
                            maxLength={PROFILE_BIO_MAX_LENGTH}
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                            placeholder="Viết một vài dòng giới thiệu về bạn..."
                        />
                        <div className="text-right text-xs text-muted-foreground">{bio.length}/{PROFILE_BIO_MAX_LENGTH}</div>
                    </div>
                )}
            </div>

            <div className="px-6 pb-6">
                <p className="rounded-lg border border-dashed border-cyan-200/60 bg-cyan-50/55 p-3 text-xs text-cyan-800 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300">
                    {PROFILE_COVER_HINT_TEXT}
                </p>
            </div>
        </div>
    )
}
export default ProfileCard