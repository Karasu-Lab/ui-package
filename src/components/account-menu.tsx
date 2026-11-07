"use client";

import type { ReactNode } from "react";
import { Button } from "./button";
import { PopUpMenu } from "./popup-menu";
import { useSessionUser } from "./session-provider";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { UserIcon } from "./user-icon";

export interface AccountMenuLabels {
    signIn?: string;
    settings?: string;
    signOut?: string;
}

export interface AccountMenuProps {
    signInHref: string;
    settingsHref?: string;
    onSignOut: () => void | Promise<void>;
    labels?: AccountMenuLabels;
    triggerAriaLabel?: string;
    children?: ReactNode;
    afterItems?: ReactNode;
}

const defaultLabels: Required<AccountMenuLabels> = {
    signIn: "サインイン",
    settings: "設定",
    signOut: "サインアウト",
};

export function AccountMenu({
    signInHref,
    settingsHref,
    onSignOut,
    labels,
    triggerAriaLabel,
    children,
    afterItems,
}: AccountMenuProps) {
    const { signIn, settings, signOut } = { ...defaultLabels, ...labels };
    const user = useSessionUser();

    if (!user) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    window.location.href = signInHref;
                }}
            >
                {signIn}
            </Button>
        );
    }

    return (
        <UserIcon user={user} triggerAriaLabel={triggerAriaLabel}>
            <PopUpMenu>
                {children}
                {settingsHref && (
                    <DropdownMenuItem render={<a href={settingsHref} />}>
                        {settings}
                    </DropdownMenuItem>
                )}
                <form action={onSignOut}>
                    <DropdownMenuItem
                        nativeButton={true}
                        render={<button type="submit" className="w-full" />}
                    >
                        {signOut}
                    </DropdownMenuItem>
                </form>
                {afterItems}
            </PopUpMenu>
        </UserIcon>
    );
}
