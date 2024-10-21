"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllUsersAndGuests,
  getAllUsersAndGuestsByName,
} from "@/lib/ActionUsers";
import { set } from "date-fns";

export default function Page() {
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  const [guestsInfo, setGuestsInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectValue, setSelectValue] = useState("tous");
  const [showUsers, setShowUsers] = useState<boolean>(true);
  const [showGuests, setShowGuests] = useState<boolean>(true);

  const [searchUsers, setSearchUsers] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const { users, guests } = await getAllUsersAndGuests();
        if (users !== null && guests !== null) {
          setUsersInfo(users);
          setGuestsInfo(guests);
          setLoading(false);
        } else {
          setLoading(false);
          setError("Not found");
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError("Error");
      }
    };
    fetch();
  }, []);

  function handleSelectChange(value: string) {
    setSelectValue(value);
  }

  useEffect(() => {
    if (selectValue === "tous") {
      setShowUsers(true);
      setShowGuests(true);
    } else if (selectValue === "user") {
      setShowUsers(true);
      setShowGuests(false);
    } else if (selectValue === "guest") {
      setShowUsers(false);
      setShowGuests(true);
    }
  }, [selectValue]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (searchUsers == "") {
          const { users, guests } = await getAllUsersAndGuests();
          if (users !== null && guests !== null) {
            setUsersInfo(users);
            setGuestsInfo(guests);
            setLoading(false);
          } else {
            setLoading(false);
            setError("Not found");
          }
        } else {
          const { users, guests } =
            await getAllUsersAndGuestsByName(searchUsers);

          if (users !== null || guests !== null) {
            setUsersInfo(users);
            setGuestsInfo(guests);
            setLoading(false);
          } else {
            setLoading(false);
            setError("Not found");
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError("Error");
      }
    };
    fetch();
  }, [searchUsers]);

  return (
    <div className="my-10">
      <div className="flex justify-between">
        <Input
          placeholder="Rechercher..."
          value={searchUsers}
          onChange={(e) => setSearchUsers(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectValue} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Les deux</SelectItem>
            <SelectItem value="user">Utilisateurs</SelectItem>
            <SelectItem value="guest">Invités</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Email vérifié</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showUsers
            ? usersInfo.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.emailVerified ? "Oui" : "Non"}</TableCell>
                </TableRow>
              ))
            : null}
          {showGuests
            ? guestsInfo.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell></TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>GUEST</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
