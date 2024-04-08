// team model 
class Team {
    constructor( teamName, description, coach, teamLogo, blackList,createdAt,updatedAt,createdBy ) {
        (this.teamName = teamName), 
        (this.description = description),
        (this.coach = coach),
        (this.teamLogo = teamLogo),
        (this.blackList = blackList),
        (this.createdAt = createdAt),
        (this.updatedAt = updatedAt),
        (this.createdBy = createdBy);
    }
}

export default Team;