import { useQuery } from "@tanstack/react-query";
import { PostNewApplcation,PostKYCScreening,PostApplicationStatus,PostComplianceCheck, PostAuditTrails, PostFabDocs } from "./Api";

export function usePostNewApplication(schemaId){
    return useQuery({
        queryKey:['NewApplicationTable'],
        queryFn:()=>PostNewApplcation(schemaId)
    })
}

export function usePostKYCScreening(schemaID){
    return useQuery({
        queryKey:['KYCScreeningTable'],
        queryFn:()=>PostKYCScreening(schemaID)
    })
}

export function usePostApplicationStatus(schemaID){
    return useQuery({
        queryKey:['applicationStatusTable'],
        queryFn:()=>PostApplicationStatus(schemaID)
    })
}
export function usePostComplianceCheck(schemaID){
    return useQuery(
        {
            queryKey:['compliancecheckTable'],
            queryFn:()=>PostComplianceCheck(schemaID)
        }
    )
}

export function usePostAuditTrails(schemaID){
    return useQuery({
        queryKey:['auditTrailsTable'],
        queryFn:()=>PostAuditTrails(schemaID)
    })
}

export function usePostFabDocs(endpoint,docData){
    return useQuery({
        queryKey:['fabDocs'],
        queryFn:()=>PostFabDocs(endpoint,docData)
    })
}


