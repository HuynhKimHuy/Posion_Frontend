import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AddFriendModalProps } from "../AddFriendModal";
import {DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface SearchFormProps {
    register: UseFormRegister<AddFriendModalProps>;
    errors  :FieldErrors<AddFriendModalProps>
    loading: boolean;
    userNameValue: string;
    isFound: boolean  | null;
    searchUserName: string;
    onSubmit:(e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}
const SearchForm = ({ register, errors, loading, userNameValue, isFound, searchUserName, onSubmit, onCancel }: SearchFormProps) => {
    return (
        
        <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
            </label>
            <input
                id="username"
                {...register("username", { required: "Username is required" })}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-smooth "
                placeholder="Enter username"
            />
            {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}

            {isFound === false && (
                <p className="text-red-500 text-sm">User not found</p>
            )}

        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 glass hover:text-destructive"
                >
                    Cancel
                </Button>
            </DialogClose>

            <button
                type="submit"
                disabled={loading || !userNameValue.trim()}
                className="flex-1 glass hover:text-primary"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </DialogFooter>
        </form>
    )
}


export default SearchForm;