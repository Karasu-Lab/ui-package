import { test, expect } from "@playwright/experimental-ct-react";
import { NestedDialogs } from "./dialog.stories";

test("nested dialog renders its own backdrop over the first dialog", async ({
    mount,
    page,
}) => {
    await mount(<NestedDialogs />);
    await page.getByRole("button", { name: "Open first" }).click();
    await page.getByRole("button", { name: "Open second" }).click();
    await expect(page.getByRole("dialog", { name: "Second" })).toBeVisible();
    await expect(page.locator('[data-slot="dialog-backdrop"]')).toHaveCount(2);
});

test("clicking the blank area closes only the nested dialog", async ({
    mount,
    page,
}) => {
    await mount(<NestedDialogs />);
    await page.getByRole("button", { name: "Open first" }).click();
    await page.getByRole("button", { name: "Open second" }).click();
    await expect(page.getByRole("dialog", { name: "Second" })).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByRole("dialog", { name: "Second" })).toBeHidden();
    await expect(page.getByRole("dialog", { name: "First" })).toBeVisible();
});

test("dialogs close in the order they were opened", async ({ mount, page }) => {
    await mount(<NestedDialogs />);
    await page.getByRole("button", { name: "Open first" }).click();
    await page.getByRole("button", { name: "Open second" }).click();
    await expect(page.getByRole("dialog", { name: "Second" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Second" })).toBeHidden();
    await expect(page.getByRole("dialog", { name: "First" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "First" })).toBeHidden();
});
