const boxMullerTransform = () => {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    
    return { z0, z1 };
}

const getNormallyDistributedRandomNumber = (mean, stddev) => {
    const { z0, _ } = boxMullerTransform();
    
    return z0 * stddev + mean;
}

const sumValues = obj => {
    if (obj === undefined) {
        return 0;
    }
    return ( Object.values(obj).reduce((a, b) => a + b)) - 1;
}


export default class Player {
    constructor(player, teamId) {
        this.playerName = player.fullName;
        this.playerObj = player;
        this.playerScore = player.totalPoints;
        this.position = player.rosteredPosition === 'RB/WR/TE' ? 'FLEX' : player.rosteredPosition;
        this.team = player.proTeamAbbreviation;
        this.fantasyTeamId = teamId;
        this.projected = Number(sumValues(player.projectedPointBreakdown).toFixed(2));
        this.yetToPlay = !player.locked;
        this.playerId = player.id;
        let ceilingFloor = this.getCeilingFloor(player);
        this.ceiling = ceilingFloor.ceiling;
        this.floor = ceilingFloor.floor;
    }

    get random() {
        let points = 0;
        Object.keys(this.playerObj.projectedRawStats).forEach(stat => {
            let val = 0;
            switch (stat) {
                case 'passingYards':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;    
                    points += val * 0.04;
                    break;
                case 'rushingYards':
                case 'receivingYards':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 0.1;
                    break;
                case 'passingTouchdowns':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 4;
                    break;
                case 'rushingTouchdowns':
                case 'receivingTouchdowns':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 6;
                    break;
                case 'receivingReceptions':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val;
                    break;
                case 'passingInterceptions':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * -2;
                    break;
                case 'passing2PtConversions':
                case 'rushing2PtConversions':
                case 'receiving2PtConversions':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 2;
                    break;
                case 'lostFumbles':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * -2;
                    break;
                case 'defensiveSacks':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val;
                    break;
                case 'defensiveBlockedKickForTouchdowns':
                case 'interceptionReturnTouchdown':
                case 'fumbleReturnTouchdown':
                case 'puntReturnTouchdown':
                case 'kickoffReturnTouchdown':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 6;
                    break;
                case 'defensiveInterceptions':
                case 'defensiveFumbles':
                case 'defensiveSafeties':
                case 'defensiveBlockedKicks':
                    val = getNormallyDistributedRandomNumber(this.playerObj.projectedRawStats[stat], this.playerObj.projectedVariance[stat]**(1/2));
                    val = val < 0 ? 0 : val;
                    points += val * 2;
                    break;
                
                default:
                    if (stat in this.playerObj.projectedPointBreakdown && stat !== 'usesPoints') {
                        points += this.playerObj.projectedPointBreakdown[stat];
                    }
                    break;
            }
        });
        return points;
    }


    

    getCeilingFloor(player) {
        let ceiling = 0;
        let floor = 0;
        Object.keys(player.projectedRawStats).forEach(stat => {
            switch (stat) {
                case 'passingYards':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 0.04;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 0.04;
                    break;
                case 'rushingYards':
                case 'receivingYards':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 0.1;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 0.1;
                    break;
                case 'passingTouchdowns':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 4;
                    ceiling += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 4;
                    break;
                case 'rushingTouchdowns':
                case 'receivingTouchdowns':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 6;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 6;
                    break;
                case 'receivingReceptions':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]);
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]);
                    break;
                case 'passingInterceptions':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * -2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * -2;
                    break;
                case 'passing2PtConversions':
                case 'rushing2PtConversions':
                case 'receiving2PtConversions':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 2;
                    break;
                case 'lostFumbles':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * -2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * -2;
                    break;
                case 'defensiveSacks':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 1;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 1;
                    break;
                case 'defensiveBlockedKickForTouchdowns':
                case 'interceptionReturnTouchdown':
                case 'fumbleReturnTouchdown':
                case 'puntReturnTouchdown':
                case 'kickoffReturnTouchdown':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 6;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 6; 
                    break;
                case 'defensiveInterceptions':
                case 'defensiveFumbles':
                case 'defensiveSafeties':
                case 'defensiveBlockedKicks':
                    ceiling += (player.projectedRawStats[stat] + player.projectedVariance[stat]) * 2;
                    floor += (player.projectedRawStats[stat] - player.projectedVariance[stat]) < 0 ? 0: (player.projectedRawStats[stat] - player.projectedVariance[stat]) * 2;
                    break;
                
                default:
                    if (stat in player.projectedPointBreakdown && stat !== 'usesPoints') {
                        ceiling += player.projectedPointBreakdown[stat];
                        floor += player.projectedPointBreakdown[stat];
                    }
                    break;
            }
            
        });
        return {ceiling: ceiling, floor: floor};
    }
}