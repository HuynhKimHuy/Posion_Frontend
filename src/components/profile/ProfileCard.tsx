import type { User } from "@/types/user"
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { userStore } from "@/stores/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Camera, CheckCircle2, Mail, PencilLine, Save, Shield, UserRound, X } from "lucide-react";
import {
    PROFILE_BIO_MAX_LENGTH,
    PROFILE_COVER_HINT_TEXT,
    PROFILE_EMPTY_BIO_TEXT,
    PROFILE_FALLBACK_TEXT,
    PROFILE_NAME_MAX_LENGTH,
    PROFILE_USERNAME_MAX_LENGTH,
} from "./profile.constants";
import { buildProfileDisplayName, formatProfileDateTime, getProfileInitials, getReadableRole } from "./profile.utils";

interface ProfileCardProps {
    user: User | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
    const updateProfile = useAuthStore((state) => state.updateProfile)
    const updateCoverImage = useAuthStore((state) => state.updateCoverImage)
    const updateAvatar = userStore((state) => state.updateAvatar)
    const loading = useAuthStore((state) => state.loading)
    const [draftProfile, setDraftProfile] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        bio: "",
    })
    const [isEditingBio, setIsEditingBio] = useState(false)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const [coverUploading, setCoverUploading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const avatarInputRef = useRef<HTMLInputElement | null>(null)
    const coverInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview)
            }
            if (coverPreview) {
                URL.revokeObjectURL(coverPreview)
            }
        }
    }, [avatarPreview, coverPreview])

    if (!user) return null

    const currentBio = user.bio || PROFILE_EMPTY_BIO_TEXT
    const displayName = buildProfileDisplayName(user)
    const avatarImage = avatarPreview || user.avatarUrl || ""
    const coverImage = coverPreview || user.coverUrl || ""
    const defaultFormValues = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userName: user.userName || "",
        bio: user.bio || "",
    }
    const accountCreatedAt = formatProfileDateTime(user.createdAt)
    const accountUpdatedAt = formatProfileDateTime(user.updatedAt)
    const roleText = getReadableRole(user.roles)
    const verificationText = user.verfify ? "Da xac minh" : "Chua xac minh"
    const verificationTone = user.verfify ? "default" : "secondary"

    const openAvatarPicker = () => {
        avatarInputRef.current?.click()
    }

    const resetDraftFromUser = () => {
        setDraftProfile(defaultFormValues)
    }

    const openCoverPicker = () => {
        coverInputRef.current?.click()
    }

    const handlePickAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview)
        }

        const localUrl = URL.createObjectURL(file)
        setAvatarPreview(localUrl)

        const formData = new FormData()
        formData.append("avatar", file)

        try {
            setAvatarUploading(true)
            const updatedUser = await updateAvatar(formData)
            if (updatedUser?.avatarUrl) {
                URL.revokeObjectURL(localUrl)
                setAvatarPreview(updatedUser.avatarUrl)
            }
        } catch {
            URL.revokeObjectURL(localUrl)
            setAvatarPreview(user.avatarUrl || null)
        } finally {
            setAvatarUploading(false)
        }

        event.target.value = ""
    }

    const handlePickCoverImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (coverPreview) {
            URL.revokeObjectURL(coverPreview)
        }
        const localUrl = URL.createObjectURL(file)
        setCoverPreview(localUrl)

        try {
            setCoverUploading(true)
            const updatedUser = await updateCoverImage(file)
            if (updatedUser?.coverUrl) {
                URL.revokeObjectURL(localUrl)
                setCoverPreview(updatedUser.coverUrl)
            }
        } catch {
            URL.revokeObjectURL(localUrl)
            setCoverPreview(user.coverUrl || null)
        } finally {
            setCoverUploading(false)
        }

        event.target.value = ""
    }

    const handleChangeField = (field: "firstName" | "lastName" | "userName" | "bio", value: string) => {
        setDraftProfile((previous) => ({
            ...previous,
            [field]: value,
        }))
    }

    const handleStartEdit = () => {
        resetDraftFromUser()
        setIsEditingBio(true)
    }

    const handleSaveProfile = async () => {
        await updateProfile({
            firstName: draftProfile.firstName,
            lastName: draftProfile.lastName,
            userName: draftProfile.userName,
            bio: draftProfile.bio,
        })
        setIsEditingBio(false)
    }

    const handleCancelBioEdit = () => {
        resetDraftFromUser()
        setIsEditingBio(false)
    }

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/20 bg-card/70 shadow-xl backdrop-blur-sm">
            <div className="relative h-40 w-full overflow-hidden border-b border-white/20 bg-linear-to-r from-sky-500/25 via-cyan-400/15 to-emerald-400/20 sm:h-48">
                {coverImage ? (
                    <img src={coverImage} alt="Cover" className="h-full w-full object-cover opacity-85" />
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_45%),linear-gradient(120deg,rgba(56,189,248,0.35),rgba(16,185,129,0.22),rgba(14,165,233,0.28))]" />
                )}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="rounded-full px-3"
                        onClick={openCoverPicker}
                        disabled={loading || coverUploading}
                    >
                        <Camera className="size-4" />
                        {coverUploading ? "Dang tai..." : "Doi anh bia"}
                    </Button>
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => void handlePickCoverImage(event)}
                    />
                </div>
            </div>

            <div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
                <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-14">
                    <div className="flex items-end gap-3 sm:gap-4">
                        <div className="relative">
                            <Avatar className="size-24 border-4 border-background shadow-md sm:size-28">
                                <AvatarImage src={avatarImage} alt={displayName} />
                                <AvatarFallback className="text-lg font-semibold">{getProfileInitials(displayName)}</AvatarFallback>
                            </Avatar>
                            <Button
                                type="button"
                                size="icon-sm"
                                className="absolute right-0 bottom-0 rounded-full"
                                onClick={openAvatarPicker}
                                disabled={loading || avatarUploading}
                            >
                                <Camera className="size-4" />
                            </Button>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => void handlePickAvatar(event)}
                            />
                        </div>
                        <div className="pb-1 sm:pb-2">
                            <h2 className="text-lg font-bold leading-tight sm:text-xl">{displayName}</h2>
                            <p className="text-sm text-muted-foreground">@{user.userName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            {avatarUploading ? <p className="text-xs text-cyan-700">Dang tai avatar...</p> : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 px-4 pb-5 sm:px-6 sm:pb-6">
                <div className="grid gap-3 rounded-xl border bg-background/70 p-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Vai tro</p>
                        <div className="mt-2 flex items-center gap-2">
                            <Shield className="size-4 text-cyan-600" />
                            <span className="text-sm font-semibold">{roleText}</span>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Trang thai</p>
                        <div className="mt-2 flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            <Badge variant={verificationTone}>{verificationText}</Badge>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                        <div className="mt-2 flex items-center gap-2">
                            <Mail className="size-4 text-sky-600" />
                            <span className="truncate text-sm">{user.email || PROFILE_FALLBACK_TEXT}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Thong tin ho so</h3>
                    {!isEditingBio ? (
                        <Button type="button" variant="outline" size="sm" onClick={handleStartEdit}>
                            <PencilLine className="size-4" />
                            Chinh sua profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={handleCancelBioEdit}>
                                <X className="size-4" />
                                Huy
                            </Button>
                            <Button type="button" size="sm" onClick={() => void handleSaveProfile()} disabled={loading}>
                                <Save className="size-4" />
                                {loading ? "Dang luu..." : "Luu"}
                            </Button>
                        </div>
                    )}
                </div>

                {!isEditingBio ? (
                    <div className="space-y-4 rounded-lg border bg-background/80 p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ho</p>
                                <p className="mt-1 text-sm font-medium">{user.firstName || PROFILE_FALLBACK_TEXT}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ten</p>
                                <p className="mt-1 text-sm font-medium">{user.lastName || PROFILE_FALLBACK_TEXT}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Username</p>
                                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                    <UserRound className="size-4 text-muted-foreground" />
                                    @{user.userName || PROFILE_FALLBACK_TEXT}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ngay tao tai khoan</p>
                                <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                    <CalendarDays className="size-4 text-muted-foreground" />
                                    {accountCreatedAt}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Bio</p>
                            <p className="mt-2 rounded-lg border bg-muted/25 p-3 text-sm text-muted-foreground">{currentBio}</p>
                        </div>

                        <p className="text-xs text-muted-foreground">Cap nhat lan cuoi: {accountUpdatedAt}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label htmlFor="profile-first-name" className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">Ho</label>
                                <Input
                                    id="profile-first-name"
                                    maxLength={PROFILE_NAME_MAX_LENGTH}
                                    value={draftProfile.firstName}
                                    onChange={(event) => handleChangeField("firstName", event.target.value)}
                                    placeholder="Nhap ho"
                                />
                            </div>
                            <div>
                                <label htmlFor="profile-last-name" className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">Ten</label>
                                <Input
                                    id="profile-last-name"
                                    maxLength={PROFILE_NAME_MAX_LENGTH}
                                    value={draftProfile.lastName}
                                    onChange={(event) => handleChangeField("lastName", event.target.value)}
                                    placeholder="Nhap ten"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="profile-username" className="mb-1 block text-xs uppercase tracking-wide text-muted-foreground">Username</label>
                            <Input
                                id="profile-username"
                                maxLength={PROFILE_USERNAME_MAX_LENGTH}
                                value={draftProfile.userName}
                                onChange={(event) => handleChangeField("userName", event.target.value)}
                                placeholder="username"
                            />
                        </div>
                        <Textarea
                            id="profile-bio"
                            rows={4}
                            maxLength={PROFILE_BIO_MAX_LENGTH}
                            value={draftProfile.bio}
                            onChange={(event) => handleChangeField("bio", event.target.value)}
                            placeholder="Viet mot vai dong gioi thieu ve ban..."
                        />
                        <div className="text-right text-xs text-muted-foreground">{draftProfile.bio.length}/{PROFILE_BIO_MAX_LENGTH}</div>
                    </div>
                )}
            </div>

            <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                <p className="rounded-lg border border-dashed border-cyan-200/60 bg-cyan-50/55 p-3 text-xs text-cyan-800 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300">
                    {PROFILE_COVER_HINT_TEXT}
                </p>
            </div>
        </div>
    )
}
export default ProfileCard