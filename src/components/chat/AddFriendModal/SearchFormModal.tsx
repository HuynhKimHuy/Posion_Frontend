import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AddFriendModalProps } from "../AddFriendModal";
import {DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";


interface SearchFormProps {
    register: UseFormRegister<AddFriendModalProps>;
    errors  :FieldErrors<AddFriendModalProps>
    loading: boolean;
    userNameValue: string;
    isFound: boolean  | null;
    onSubmit:(e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}
const SearchForm = ({ register, errors, loading, userNameValue, isFound, onSubmit, onCancel }: SearchFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
                    Username
                </label>
                <div className="relative">
                    <input
                        id="username"
                        {...register("username", { required: "Username is required" })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                        placeholder="Enter username"
                    />
                    {loading && <div className="absolute right-3 top-3 animate-spin"><Search className="size-4" /></div>}
                </div>
                {errors.username && (
                    <p className="text-red-500 text-xs font-medium">{errors.username.message}</p>
                )}
                {isFound === false && (
                    <p className="text-red-500 text-xs font-medium">User not found</p>
                )}
            </div>

            <DialogFooter className="gap-2">
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    disabled={loading || !userNameValue.trim()}
                    className="flex-1 gap-2"
                >
                    <Search className="size-4" />
                    {loading ? "Searching..." : "Search"}
                </Button>
            </DialogFooter>
        </form>
    )
}


export default SearchForm;