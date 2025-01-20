[**@evlmaistrenko/dbd-stats-api**](../README.md)

---

[@evlmaistrenko/dbd-stats-api](../README.md) / typeDefs

# Variable: typeDefs

> `const` **typeDefs**: "\n\ttype User \{\n\t\tid: ID!\n\t\tsteamProfile: UserSteamProfile!\n\t\}\n\n\ttype UserSteamProfile \{\n\t\tsteamId: String!\n\t\tnickname: String!\n\t\}\n\n\ttype UserStats \{\n\t\tuser: User!\n\t\t\"Status X12\"\n\t\tstatus: UserStatsStatus!\n\t\tbloodpoints: UserStatsBloodpoints\n\t\}\n\n\ttype UserStatsBloodpoints \{\n\t\ttotal: Int!\n\t\}\n\n\tenum UserStatsStatus \{\n\t\tQUEUED\n\t\tACTUAL\n\t\}\n\n\tinput UserStatsOptions \{\n\t\tskip: Int\n\t\tlimit: Int\n\t\tsort: \[UserStatsSort!\]\n\t\}\n\n\tenum UserStatsSort \{\n\t\tTOTAL_BLOODPOINTS_ASC\n\t\tTOTAL_BLOODPOINTS_DESC\n\t\}\n\n\ttype Query \{\n\t\tuser(id: ID!): User\n\t\tstats(userId: ID, options: UserStatsOptions): \[UserStats\]\n\t\}\n\n\ttype Subscription \{\n\t\tstats(userId: ID, options: UserStatsOptions): \[UserStats\]\n\t\}\n"
